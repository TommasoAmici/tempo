use crate::{
    auth::{
        authenticate_user, create_user, parse_header::user_id_from_authorization_header,
        regenerate_token, UserAuth, UserSignupAuth,
    },
    errors::Error,
};
use actix_web::{post, web, Error as AWError, HttpRequest, HttpResponse};
use serde_json::json;
use sqlx::SqlitePool;

#[post("/signup")]
pub async fn signup(
    db: web::Data<SqlitePool>,
    user: web::Json<UserSignupAuth>,
) -> Result<HttpResponse, AWError> {
    if user.password != user.repeat_password {
        return Err(Error::PasswordsDontMatch.into());
    }

    let token = create_user(&db, &user).await?;

    Ok(HttpResponse::Created().json(json!({ "token": token })))
}

#[post("/login")]
pub async fn login(
    db: web::Data<SqlitePool>,
    user: web::Json<UserAuth>,
) -> Result<HttpResponse, AWError> {
    let user_data = authenticate_user(&db, &user).await?;

    Ok(HttpResponse::Ok().json(json!({ "user_id": user_data.0, "token": user_data.1 })))
}

#[post("/token/generate")]
pub async fn token_generate(
    req: HttpRequest,
    db: web::Data<SqlitePool>,
) -> Result<HttpResponse, AWError> {
    let user_id = user_id_from_authorization_header(&req, &db).await?;

    let token = regenerate_token(&db, user_id).await?;

    Ok(HttpResponse::Ok().json(json!({ "token": token })))
}
