use super::azure;
use super::db;
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
        r"(?x)^[\w\s\.-]+(
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

#[SimpleObject(desc = "A file")]
pub struct File {
    #[field(desc = "The id of the file")]
    pub id: ID,
    #[field(desc = "The title of the file")]
    pub title: String,
    #[field(desc = "The description of the file")]
    pub description: String,
    #[field(desc = "The id of the parent folder")]
    pub folder: ID,
    #[field(desc = "The name of the file")]
    pub file_name: String,
    #[field(desc = "The type of the file")]
    pub file_type: String,
    #[field(desc = "The time the file was created")]
    pub created_at: DateTime<Utc>,
    #[field(desc = "The time the file was modified")]
    pub modified_at: DateTime<Utc>,
    #[field(desc = "The time the file was deleted")]
    pub deleted_at: Option<DateTime<Utc>>,
}

#[InputObject]
#[derive(Debug, Validate)]
#[validate(schema(
    function = "match_file_type",
    message = "filename extension does not match MIME type",
))]
pub struct NewFile {
    pub title: String,
    pub description: String,
    pub folder: ID,
    #[validate(
        length(
            min = 5,
            max = 255,
            message = "file_name must be between 5 and 255 characters long"
        ),
        regex(
            path = "ALLOWED_FILENAME_CHARS",
            message = "filename contains characters that are not alphanumeric, space, period, hyphen or underscore"
        ),
        regex(
            path = "ALLOWED_EXTENSIONS",
            message = "filename does not have an allowed extension"
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
        if extensions2(new_file.file_type.clone()).any(|possible| ext == possible) {
            Ok(())
        } else {
            Err(ValidationError::new("bad MIME type"))
        }
    } else {
        Err(ValidationError::new("bad extension"))
    }
}

impl From<db::File> for File {
    fn from(d: db::File) -> Self {
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
    #[field(desc = "Get all Files in a Folder")]
    async fn files_by_folder(&self, context: &Context<'_>, folder: ID) -> FieldResult<Vec<File>> {
        let pool = context.data()?;
        let folder = Uuid::parse_str(&folder)?;
        let files = db::File::find_by_folder(folder, pool).await?;

        Ok(files.into_iter().map(Into::into).collect())
    }

    #[field(desc = "Get file by ID")]
    async fn file(&self, context: &Context<'_>, id: ID) -> FieldResult<File> {
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
    #[field(desc = "Create a new file (returns the created file)")]
    async fn create_file(&self, context: &Context<'_>, new_file: NewFile) -> FieldResult<File> {
        new_file.validate()?;

        let pool = context.data()?;
        let azure_config = context.data()?;
        let folder = Uuid::parse_str(&new_file.folder)?;
        let destination = azure::copy_blob_from_url(
            &Url::parse(&new_file.temporary_blob_storage_path)?,
            azure_config,
        )
        .await?;

        // TODO: add event.

        let file = db::File::create(
            &new_file.title,
            &new_file.description,
            &folder,
            &new_file.file_name,
            &new_file.file_type,
            &destination,
            pool,
        )
        .await?;

        Ok(file.into())
    }

    #[field(desc = "Deletes a file by id(returns delete file")]
    async fn delete_file(&self, context: &Context<'_>, id: ID) -> FieldResult<File> {
        let pool = context.data()?;
        let file: File = db::File::delete(Uuid::parse_str(&id)?, pool).await?.into();

        Ok(file)
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use test_case::test_case;

    #[test_case("filename.doc", Some("application/msword"), "no errors" ; "good extension doc")]
    #[test_case("filename.docx", Some("application/vnd.openxmlformats-officedocument.wordprocessingml.document"), "no errors" ; "good extension docx")]
    #[test_case("filename.zip", None, "filename does not have an allowed extension" ; "bad extension zip")]
    #[test_case(".doc", None, "file_name must be between 5 and 255 characters long"; "too short")]
    #[test_case("%.doc", None, "filename contains characters that are not alphanumeric, space, period, hyphen or underscore"; "bad char percent")]
    #[test_case("🦀.doc", None, "filename contains characters that are not alphanumeric, space, period, hyphen or underscore"; "bad char emoji")]
    fn validate_filename(file_name: &str, file_type: Option<&str>, expected: &str) {
        let actual = NewFile {
            title: "".to_string(),
            description: "".to_string(),
            folder: "".into(),
            file_name: file_name.to_string(),
            file_type: file_type.unwrap_or("").to_string(),
            temporary_blob_storage_path: "".to_string(),
        }
        .validate()
        .map_or_else(
            |es| format!("{:?}", es.into_errors().get("file_name").unwrap()),
            |_| "no errors".to_string(),
        );
        assert!(actual.contains(expected));
    }
}
