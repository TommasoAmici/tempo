use crate::lib::{
    auth::parse_header::user_id_from_authorization_header,
    queries::{self, analysis::days_heatmap},
};
use actix_web::{get, web, Error as AWError, HttpRequest, HttpResponse};
use sqlx::SqlitePool;

#[get("/heatmap")]
async fn heatmap(req: HttpRequest, db: web::Data<SqlitePool>) -> Result<HttpResponse, AWError> {
    let user_id = user_id_from_authorization_header(&req, &db).await?;
    let data = days_heatmap(&db, user_id).await?;
    Ok(HttpResponse::Ok().json(data))
}

#[get("/languages")]
async fn languages(req: HttpRequest, db: web::Data<SqlitePool>) -> Result<HttpResponse, AWError> {
    let user_id = user_id_from_authorization_header(&req, &db).await?;
    let data = queries::analysis::languages_activity(&db, user_id, None, None, None).await?;
    Ok(HttpResponse::Ok().json(data))
}

#[get("/branches")]
async fn branches(req: HttpRequest, db: web::Data<SqlitePool>) -> Result<HttpResponse, AWError> {
    let user_id = user_id_from_authorization_header(&req, &db).await?;
    let data = queries::analysis::branches_activity(&db, user_id, None, None).await?;
    Ok(HttpResponse::Ok().json(data))
}
