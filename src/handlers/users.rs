use crate::lib::auth::{
    authenticate_user, create_user, parse_header::user_id_from_authorization_header,
    regenerate_token, UserAuth,
};
use actix_web::{post, web, Error as AWError, HttpRequest, HttpResponse};
use serde_json::json;
use sqlx::SqlitePool;

#[post("/signup")]
async fn signup(
    db: web::Data<SqlitePool>,
    user: web::Json<UserAuth>,
) -> Result<HttpResponse, AWError> {
    let token = create_user(&db, &user).await?;

    Ok(HttpResponse::Created().json(json!({ "token": token })))
}

#[post("/login")]
async fn login(
    db: web::Data<SqlitePool>,
    user: web::Json<UserAuth>,
) -> Result<HttpResponse, AWError> {
    let token = authenticate_user(&db, &user).await?;

    Ok(HttpResponse::Ok().json(json!({ "token": token })))
}

#[post("/token/generate")]
async fn token_generate(
    req: HttpRequest,
    db: web::Data<SqlitePool>,
) -> Result<HttpResponse, AWError> {
    let user_id = user_id_from_authorization_header(&req, &db).await?;

    let token = regenerate_token(&db, user_id).await?;

    Ok(HttpResponse::Ok().json(json!({ "token": token })))
}
