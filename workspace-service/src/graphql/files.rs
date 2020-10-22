use super::{azure, db, validation};
use async_graphql::{Context, FieldResult, InputObject, Object, SimpleObject, ID};
use chrono::{DateTime, Utc};
use lazy_static::lazy_static;
use mime_db::extensions2;
use regex::Regex;
use url::Url;
use uuid::Uuid;
use validator::{Validate, ValidationError};

lazy_static! {
    static ref ALLOWED_FILENAME_CHARS: Regex = Regex::new(r"^[\w\s\.-]+$").expect("bad regex");
    static ref ALLOWED_EXTENSIONS: Regex = Regex::new(
        r"(?x)\.(
            (bmp)|
            (doc)|
            (docx)|
            (eps)|
            (gif)|
            (jpeg)|
            (jpg)|
            (odp)|
            (ods)|
            (odt)|
            (pdf)|
            (png)|
            (ppt)|
            (pptx)|
            (svg)|
            (txt)|
            (webp)|
            (xls)|
            (xslx)
        )$"
    )
    .expect("bad regex");
}

/// A file
#[derive(SimpleObject)]
pub struct File {
    /// The id of the file
    pub id: ID,
    /// The title of the file
    pub title: String,
    /// The description of the file
    pub description: String,
    /// The id of the parent folder
    pub folder: ID,
    /// The name of the file
    pub file_name: String,
    /// The type of the file
    pub file_type: String,
    /// The time the file was created
    pub created_at: DateTime<Utc>,
    /// The time the file was modified
    pub modified_at: DateTime<Utc>,
    /// The time the file was deleted
    pub deleted_at: Option<DateTime<Utc>>,
}

#[derive(InputObject, Debug, Validate)]
#[validate(schema(
    function = "match_file_type",
    message = "the file extension is not valid for the specified MIME type",
))]
pub struct NewFile {
    pub title: String,
    pub description: String,
    pub folder: ID,
    #[validate(
        length(
            min = 5,
            max = 255,
            message = "the file name must be between 5 and 255 characters long"
        ),
        regex(
            path = "ALLOWED_FILENAME_CHARS",
            message = "the file name contains characters that are not alphanumeric, space, period, hyphen or underscore"
        ),
        regex(
            path = "ALLOWED_EXTENSIONS",
            message = "the file name does not have an allowed extension"
        )
    )]
    pub file_name: String,
    pub file_type: String,
    pub temporary_blob_storage_path: String,
}

fn match_file_type(new_file: &NewFile) -> Result<(), ValidationError> {
    let extension = ALLOWED_EXTENSIONS
        .captures(&new_file.file_name)
        .and_then(|captures| captures.get(1))
        .map(|m| m.as_str());
    if let Some(ext) = extension {
        if extensions2(&new_file.file_type).any(|possible| ext == possible) {
            Ok(())
        } else {
            Err(ValidationError::new("bad MIME type"))
        }
    } else {
        Err(ValidationError::new("bad extension"))
    }
}

impl From<db::FileWithVersion> for File {
    fn from(d: db::FileWithVersion) -> Self {
        Self {
            id: d.id.into(),
            title: d.title,
            description: d.description,
            folder: d.folder.into(),
            file_name: d.file_name,
            file_type: d.file_type,
            created_at: d.created_at,
            modified_at: d.modified_at,
            deleted_at: d.deleted_at,
        }
    }
}

#[derive(Default)]
pub struct FilesQuery;

#[Object]
impl FilesQuery {
    /// Get all Files in a Folder
    async fn files_by_folder(&self, context: &Context<'_>, folder: ID) -> FieldResult<Vec<File>> {
        let pool = context.data()?;
        let folder = Uuid::parse_str(&folder)?;
        let files = db::File::find_by_folder(folder, pool).await?;

        Ok(files.into_iter().map(Into::into).collect())
    }

    /// Get file by ID
    async fn file(&self, context: &Context<'_>, id: ID) -> FieldResult<File> {
        self.get_file(context, id).await
    }

    #[graphql(entity)]
    async fn get_file(&self, context: &Context<'_>, id: ID) -> FieldResult<File> {
        let pool = context.data()?;
        let id = Uuid::parse_str(&id)?;
        let file = db::File::find_by_id(id, pool).await?;
        Ok(file.into())
    }
}

#[derive(Default)]
pub struct FilesMutation;

#[Object]
impl FilesMutation {
    /// Create a new file (returns the created file)
    async fn create_file(&self, context: &Context<'_>, new_file: NewFile) -> FieldResult<File> {
        new_file
            .validate()
            .map_err(validation::ValidationError::from)?;

        let pool = context.data()?;
        let azure_config = context.data()?;
        let requesting_user = context.data::<super::RequestingUser>()?;

        let folder = Uuid::parse_str(&new_file.folder)?;
        let user = db::User::find_by_auth_id(&requesting_user.auth_id, pool).await?;
        let destination = azure::copy_blob_from_url(
            &Url::parse(&new_file.temporary_blob_storage_path)?,
            azure_config,
        )
        .await?;

        // TODO: add event.

        let mut tx = pool.begin().await?;
        let version_id = Uuid::new_v4();
        let file = db::File::create(user.id, version_id, &mut tx).await?;
        let file_version = db::FileVersion::create(
            version_id,
            folder,
            file.id,
            &new_file.title,
            &new_file.description,
            &new_file.file_name,
            &new_file.file_type,
            &destination,
            user.id,
            1,
            "",
            &mut tx,
        )
        .await?;
        tx.commit().await?;

        Ok(File {
            id: file.id.into(),
            title: file_version.file_title,
            description: file_version.file_description,
            folder: file_version.folder.into(),
            file_name: file_version.file_name,
            file_type: file_version.file_type,
            created_at: file.created_at,
            modified_at: file_version.created_at,
            deleted_at: file.deleted_at,
        })
    }

    /// Deletes a file by id(returns delete file
    async fn delete_file(&self, context: &Context<'_>, id: ID) -> FieldResult<File> {
        let pool = context.data()?;
        let requesting_user = context.data::<super::RequestingUser>()?;
        let user = db::User::find_by_auth_id(&requesting_user.auth_id, pool).await?;
        let file: File = db::File::delete(Uuid::parse_str(&id)?, user.id, pool)
            .await?
            .into();

        Ok(file)
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use test_case::test_case;

    #[test_case("filename.doc", Some("application/msword")
        , None
        ; "good extension doc")]
    #[test_case("filename.docx", Some("application/vnd.openxmlformats-officedocument.wordprocessingml.document")
        , None
        ; "good extension docx")]
    #[test_case("image.png", Some("image/png")
        , None
        ; "good mime type")]
    #[test_case("image.png", Some("image/gif")
        , Some("the file extension is not valid for the specified MIME type")
        ; "bad mime type")]
    #[test_case("filename.zip", None
        , Some("the file name does not have an allowed extension")
        ; "bad extension zip")]
    #[test_case("filename.txt", Some("text/plain")
        , None
        ; "good extension has dot")]
    #[test_case("filenametxt", None
        , Some("the file name does not have an allowed extension")
        ; "bad extension no dot")]
    #[test_case(".doc", None
        , Some("the file name must be between 5 and 255 characters long")
        ; "too short")]
    #[test_case("%.doc", None
        , Some("the file name contains characters that are not alphanumeric, space, period, hyphen or underscore")
        ; "bad char percent")]
    #[test_case("%", None
        , Some("\
            the file name must be between 5 and 255 characters long, \
            the file name contains characters that are not alphanumeric, space, period, hyphen or underscore, \
            the file name does not have an allowed extension")
        ; "multiple errors")]
    #[test_case("🦀.doc", None
        , Some("the file name contains characters that are not alphanumeric, space, period, hyphen or underscore")
        ; "bad char emoji")]
    #[test_case("xx\u{0}.doc", None
        , Some("the file name contains characters that are not alphanumeric, space, period, hyphen or underscore")
        ; "null char")]
    fn validate_filename<'a>(
        file_name: &'a str,
        file_type: Option<&'a str>,
        expected: Option<&'a str>,
    ) {
        let new_file = NewFile {
            title: "".to_string(),
            description: "".to_string(),
            folder: "".into(),
            file_name: file_name.to_string(),
            file_type: file_type.unwrap_or("").to_string(),
            temporary_blob_storage_path: "".to_string(),
        };
        let actual = new_file
            .validate()
            .map_err(validation::ValidationError::from)
            .map_err(|e| format!("{}", e))
            .err();
        assert_eq!(actual.as_deref(), expected);
    }
}
