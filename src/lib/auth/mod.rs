use crate::errors::Error;
use crate::lib::auth;
use serde::{Deserialize, Serialize};
use sqlx::SqlitePool;

pub mod parse_header;
mod password;
mod token;

#[derive(Debug, Serialize, Deserialize)]
pub struct UserAuth {
    email: String,
    password: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UserSignupAuth {
    pub email: String,
    pub password: String,
    pub repeat_password: String,
}

pub async fn create_user(pool: &SqlitePool, user: &UserSignupAuth) -> Result<String, Error> {
    let password_hash = auth::password::hash_password(&user.password)?;
    let token = auth::token::generate_api_token();
    let lower_case_email = user.email.trim().to_lowercase();
    sqlx::query!(
        "INSERT INTO users (password_hash, email, token) VALUES (?, ?, ?)",
        password_hash,
        lower_case_email,
        token
    )
    .execute(pool)
    .await
    .map_err(|e| {
        if e.to_string().contains("UNIQUE") {
            return Error::UserAlreadyExists;
        }
        return Error::DBFailedToInsert;
    })?;

    Ok(token)
}

pub async fn authenticate_user(
    pool: &SqlitePool,
    user: &UserAuth,
) -> Result<(String, String), Error> {
    let lower_case_email = user.email.trim().to_lowercase();
    let row = sqlx::query!(
        r#"SELECT CAST(id AS TEXT) AS "id!: String", password_hash, token FROM users WHERE email = ? LIMIT 1"#,
        lower_case_email,
    )
    .fetch_one(pool)
    .await
    .map_err(|_| Error::DBFailedQuery)?;

    let verified = password::verify_password(&user.password, &row.password_hash)?;

    if verified {
        return Ok((row.id, row.token));
    } else {
        return Err(Error::WrongUsernameOrPassword);
    }
}

pub async fn regenerate_token(pool: &SqlitePool, user_id: i64) -> Result<String, Error> {
    let token = auth::token::generate_api_token();

    sqlx::query!("UPDATE users set token = ? WHERE id = ?", token, user_id)
        .execute(pool)
        .await
        .map_err(|_| Error::DBFailedToInsert)?;

    Ok(token)
}
