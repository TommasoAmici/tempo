use std::collections::HashMap;

use crate::{
    auth::parse_header::user_id_from_authorization_header,
    queries::{self, analysis::days_heatmap},
};
use actix_web::{get, web, Error as AWError, HttpRequest, HttpResponse};
use serde::{Deserialize, Serialize};
use sqlx::SqlitePool;
use time::Date;

/// Query parameters for filtering data in all analysis endpoints.
/// All parameters are optional, and not specifying them will return all data.
///
/// Not all parameters are supported by all endpoints.
#[derive(Deserialize)]
pub struct FilterQueryParams {
    /// The project to filter by.
    pub project: Option<String>,
    /// The branch to filter by.
    pub branch: Option<String>,
    /// The start date to filter by.
    pub date_start: Option<Date>,
    /// The end date to filter by.
    pub date_end: Option<Date>,
    /// The maximum time, in seconds, allowed between heartbeats to be considered continuous.
    ///
    /// If not specified it defaults to 90 seconds.
    pub sensitivity: Option<i32>,
}

/// Returns the number of heartbeats per day for the given user.
/// The user is determined by the `Authorization` header.
///
/// The data can be filtered by `project`, `branch`, `date_start`, and `date_end` using
/// query parameters.
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

/// Returns the number of heartbeats per day grouped by branch for the given user.
/// The user is determined by the `Authorization` header.
///
/// The data can be filtered by `project`, `date_start`, and `date_end` using
/// query parameters.
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
