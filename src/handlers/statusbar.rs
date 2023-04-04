use crate::lib::auth::parse_header::user_id_from_authorization_header;
use crate::lib::duration::duration_status;
use crate::lib::queries;
use crate::lib::queries::statusbar::TimePerCategory;
use crate::lib::types::{Status, StatusbarResponse, StatusbarResponseData};
use actix_web::{get, web, Error as AWError, HttpRequest, HttpResponse};
use sqlx::SqlitePool;

pub fn format_time_per_category(data: &Vec<TimePerCategory>) -> Vec<Status> {
    data.iter()
        .map(|t| {
            let mut status = match t.time_spent {
                Some(time) => duration_status(time),
                None => Status::default(),
            };
            status.name = Some(t.name.clone());
            status.percent = match t.time_percentage {
                Some(t) => Some(t * 100.0),
                None => None,
            };
            return status;
        })
        .collect()
}

fn grand_total_from_category(data: &Vec<TimePerCategory>) -> Status {
    let time = data
        .iter()
        .fold(0.0, |acc, e| acc + e.time_spent.unwrap_or(0.0));
    duration_status(time)
}

#[get("/current/statusbar/today")]
async fn statusbar(req: HttpRequest, db: web::Data<SqlitePool>) -> Result<HttpResponse, AWError> {
    let user_id = user_id_from_authorization_header(&req, &db).await?;
    let projects = queries::statusbar::get_time_per_project(&db, user_id).await?;
    let languages = queries::statusbar::get_time_per_language(&db, user_id).await?;
    let formatted_projects = format_time_per_category(&projects);
    let formatted_languages = format_time_per_category(&languages);
    let grand_total = grand_total_from_category(&projects);
    let now = time::OffsetDateTime::now_utc();
    let response = StatusbarResponse {
        cached_at: now,
        data: StatusbarResponseData {
            categories: vec![],
            dependencies: vec![],
            editors: vec![],
            grand_total,
            languages: formatted_languages,
            machines: vec![],
            operating_systems: vec![],
            projects: formatted_projects,
            // range: {
            //     date: "2022-12-09",
            //     end: "2022-12-09T22:59:59Z",
            //     start: "2022-12-08T23:00:00Z",
            //     text: "Today",
            //     timezone: "Europe/Amsterdam",
            // }
        },
    };
    Ok(HttpResponse::Ok().json(response))
}
