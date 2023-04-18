use actix_web::HttpRequest;
use base64::{engine::general_purpose, Engine};
use sqlx::SqlitePool;

use std::str;

use crate::{errors::Error, lib::queries::users::get_user_id_from_api_key};

pub async fn user_id_from_authorization_header(
    req: &HttpRequest,
    pool: &SqlitePool,
) -> Result<i64, Error> {
    let header = req
        .headers()
        .get("Authorization")
        .ok_or(Error::AuthorizationMissing)?;

    // "Basic *" length
    if header.len() < 7 {
        return Err(Error::AuthorizationMissing);
    }

    let mut parts = header
        .to_str()
        .map_err(|_| Error::AuthorizationMissing)?
        .splitn(2, ' ');

    match parts.next() {
        Some(scheme) if scheme == "Basic" => (),
        _ => return Err(Error::AuthorizationMissing),
    }

    let wakapi_key = general_purpose::STANDARD
        .decode(parts.next().ok_or(Error::AuthorizationMissing)?)
        .map_err(|_| Error::AuthorizationMissing)?;

    let user_id =
        get_user_id_from_api_key(&pool, str::from_utf8(&wakapi_key).unwrap().to_string()).await?;

    Ok(user_id)
}
