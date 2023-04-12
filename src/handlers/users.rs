use crate::lib::{
    auth::{
        authenticate_user, create_user, parse_header::user_id_from_authorization_header,
        regenerate_token, UserAuth,
    },
    queries::user,
};
use actix_web::{get, post, web, Error as AWError, HttpRequest, HttpResponse};
use serde_json::json;
use sqlx::SqlitePool;

use super::analysis::FilterQueryParams;

#[post("/signup")]
pub async fn signup(
    db: web::Data<SqlitePool>,
    user: web::Json<UserAuth>,
) -> Result<HttpResponse, AWError> {
    let token = create_user(&db, &user).await?;

    Ok(HttpResponse::Created().json(json!({ "token": token })))
}

#[post("/login")]
pub async fn login(
    db: web::Data<SqlitePool>,
    user: web::Json<UserAuth>,
) -> Result<HttpResponse, AWError> {
    let token = authenticate_user(&db, &user).await?;

    Ok(HttpResponse::Ok().json(json!({ "user_id": token.0, "token": token.1 })))
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

#[get("/projects")]
pub async fn get_user_projects(
    req: HttpRequest,
    db: web::Data<SqlitePool>,
    params: web::Query<FilterQueryParams>,
) -> Result<HttpResponse, AWError> {
    let user_id = user_id_from_authorization_header(&req, &db).await?;
    let data = user::get_users_projects(&db, user_id, &params.date_start, &params.date_end).await?;
    Ok(HttpResponse::Ok().json(data))
}
