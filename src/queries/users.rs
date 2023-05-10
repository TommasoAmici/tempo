use sqlx::SqlitePool;

use crate::errors::Error;

pub async fn get_user_id_from_api_key(pool: &SqlitePool, api_key: String) -> Result<i64, Error> {
    let user = sqlx::query!("SELECT id FROM users WHERE token = ? LIMIT 1", api_key)
        .fetch_one(pool)
        .await
        .map_err(|_| Error::NotAuthorized)?;

    return Ok(user.id);
}
