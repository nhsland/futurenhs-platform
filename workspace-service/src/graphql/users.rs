use super::db;
use async_graphql::{Context, FieldResult, InputObject, Object, SimpleObject, ID};
use uuid::Uuid;

#[SimpleObject(desc = "A user")]
pub struct User {
    #[field(desc = "The id of the user")]
    pub id: ID,
    #[field(desc = "The auth id of the user")]
    pub auth_id: ID,
    #[field(desc = "The name of the user")]
    pub name: String,
    #[field(desc = "If true, user has full platform access")]
    pub is_platform_admin: bool,
}

#[InputObject]
pub struct NewUser {
    pub auth_id: ID,
    pub name: String,
}

#[InputObject]
pub struct UpdateUser {
    pub auth_id: ID,
    pub is_platform_admin: bool,
}

impl From<db::User> for User {
    fn from(d: db::User) -> Self {
        Self {
            id: d.id.into(),
            name: d.name,
            auth_id: d.auth_id.into(),
            is_platform_admin: d.is_platform_admin,
        }
    }
}

#[derive(Default)]
pub struct UsersMutation;

#[Object]
impl UsersMutation {
    #[field(desc = "Get or Create a new user (returns the user)")]
    async fn get_or_create_user(
        &self,
        context: &Context<'_>,
        new_user: NewUser,
    ) -> FieldResult<User> {
        let pool = context.data()?;
        let auth_id = Uuid::parse_str(&new_user.auth_id)?;

        Ok(db::User::get_or_create(&auth_id, &new_user.name, pool)
            .await?
            .into())
    }
    #[field(desc = "Update a user (returns the user)")]
    async fn update_user(
        &self,
        context: &Context<'_>,
        update_user: UpdateUser,
    ) -> FieldResult<User> {
        let pool = context.data()?;
        let auth_id = Uuid::parse_str(&update_user.auth_id)?;

        Ok(
            db::User::update(&auth_id, update_user.is_platform_admin, pool)
                .await?
                .into(),
        )
    }
}
