use crate::{auth::parse_header::user_id_from_authorization_header, queries};
use actix_web::{get, web, Error as AWError, HttpRequest, HttpResponse};
use sqlx::SqlitePool;

use super::analysis::FilterQueryParams;

#[get("/projects")]
pub async fn get_user_projects(
    req: HttpRequest,
    db: web::Data<SqlitePool>,
    params: web::Query<FilterQueryParams>,
) -> Result<HttpResponse, AWError> {
    let user_id = user_id_from_authorization_header(&req, &db).await?;
    let data =
        queries::projects::get_users_projects(&db, user_id, &params.date_start, &params.date_end)
            .await?;
    Ok(HttpResponse::Ok().json(data))
}

#[get("/projects/{project}/branches")]
pub async fn get_project_branches(
    req: HttpRequest,
    db: web::Data<SqlitePool>,
    project: web::Path<String>,
    params: web::Query<FilterQueryParams>,
) -> Result<HttpResponse, AWError> {
    let user_id = user_id_from_authorization_header(&req, &db).await?;
    let data = queries::projects::get_project_branches(
        &db,
        user_id,
        &project.into_inner(),
        &params.date_start,
        &params.date_end,
    )
    .await?;
    Ok(HttpResponse::Ok().json(data))
}
