use std::collections::HashMap;

use crate::lib::{
    auth::parse_header::user_id_from_authorization_header,
    queries::{self, analysis::days_heatmap},
};
use actix_web::{get, web, Error as AWError, HttpRequest, HttpResponse};
use serde::{Deserialize, Serialize};
use sqlx::SqlitePool;
use time::Date;

#[derive(Deserialize)]
pub struct FilterQueryParams {
    pub project: Option<String>,
    pub branch: Option<String>,
    pub date_start: Option<Date>,
    pub date_end: Option<Date>,
    pub sensitivity: Option<i32>,
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

time::serde::format_description!(serde_date_format, Date, "[year]-[month]-[day]");
#[derive(Serialize, Deserialize)]
struct LanguagesStreamDataPoint {
    #[serde(with = "serde_date_format")]
    x: Date,
    y: i32,
}

#[derive(Serialize, Deserialize, Default)]
struct LanguagesStreamResponse {
    id: String,
    data: Vec<LanguagesStreamDataPoint>,
}

#[get("/languages-stream")]
async fn languages_stream(
    req: HttpRequest,
    db: web::Data<SqlitePool>,
    params: web::Query<FilterQueryParams>,
) -> Result<HttpResponse, AWError> {
    let user_id = user_id_from_authorization_header(&req, &db).await?;
    let data = queries::analysis::languages_stream(&db, user_id, &params).await?;

    let mut data_by_language: HashMap<String, Vec<LanguagesStreamDataPoint>> = HashMap::new();
    for datum in data {
        let data_point = LanguagesStreamDataPoint {
            x: datum.date,
            y: datum.count,
        };
        data_by_language
            .entry(datum.language)
            .or_insert_with(Vec::new)
            .push(data_point);
    }

    let mut transformed_data: Vec<LanguagesStreamResponse> = vec![];
    for (language, data) in data_by_language {
        transformed_data.push(LanguagesStreamResponse { id: language, data });
    }
    Ok(HttpResponse::Ok().json(transformed_data))
}
