use crate::lib::{
    auth::parse_header::user_id_from_authorization_header,
    queries::{self, analysis::days_heatmap},
};
use ::serde::Deserialize;
use actix_web::{get, web, Error as AWError, HttpRequest, HttpResponse};
use sqlx::SqlitePool;
use time::Date;

#[derive(Deserialize)]
pub struct FilterQueryParams {
    pub project: Option<String>,
    pub date_start: Option<Date>,
    pub date_end: Option<Date>,
}

#[get("/heatmap")]
async fn heatmap(
    req: HttpRequest,
    db: web::Data<SqlitePool>,
    params: web::Query<FilterQueryParams>,
) -> Result<HttpResponse, AWError> {
    let user_id = user_id_from_authorization_header(&req, &db).await?;
    let data = days_heatmap(&db, user_id, &params).await?;
    Ok(HttpResponse::Ok().json(data))
}

#[get("/languages")]
async fn languages(
    req: HttpRequest,
    db: web::Data<SqlitePool>,
    params: web::Query<FilterQueryParams>,
) -> Result<HttpResponse, AWError> {
    let user_id = user_id_from_authorization_header(&req, &db).await?;
    let data = queries::analysis::languages_activity(&db, user_id, &params).await?;
    Ok(HttpResponse::Ok().json(data))
}

#[get("/branches")]
async fn branches(
    req: HttpRequest,
    db: web::Data<SqlitePool>,
    params: web::Query<FilterQueryParams>,
) -> Result<HttpResponse, AWError> {
    let user_id = user_id_from_authorization_header(&req, &db).await?;
    let data = queries::analysis::branches_activity(&db, user_id, &params).await?;
    Ok(HttpResponse::Ok().json(data))
}
