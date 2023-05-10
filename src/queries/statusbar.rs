use serde::{Deserialize, Serialize};
use sqlx::SqlitePool;

use crate::{errors::Error, handlers::analysis::FilterQueryParams};

use super::analysis;

#[derive(Debug, Serialize, Deserialize)]
pub struct TimePerCategory {
    pub name: String,
    pub time_spent: Option<f64>,
    pub time_percentage: Option<f64>,
}

pub async fn get_time_per_project(
    pool: &SqlitePool,
    user_id: i64,
) -> Result<Vec<TimePerCategory>, Error> {
    let today = time::OffsetDateTime::now_utc().date();
    let tomorrow = today + time::Duration::days(1);
    analysis::projects_activity(pool, user_id, &Some(today), &Some(tomorrow)).await
}

pub async fn get_time_per_language(
    pool: &SqlitePool,
    user_id: i64,
) -> Result<Vec<TimePerCategory>, Error> {
    let today = time::OffsetDateTime::now_utc().date();
    let tomorrow = today + time::Duration::days(1);
    analysis::languages_activity(
        pool,
        user_id,
        &FilterQueryParams {
            project: None,
            branch: None,
            date_end: Some(today),
            date_start: Some(tomorrow),
            sensitivity: None,
        },
    )
    .await
}

pub async fn _get_time_per_branch(
    pool: &SqlitePool,
    user_id: i64,
) -> Result<Vec<TimePerCategory>, Error> {
    let results =
        sqlx::query_file_as!(TimePerCategory, "src/queries/time_per_branch.sql", user_id,)
            .fetch_all(pool)
            .await
            .map_err(|_| Error::DBFailedQuery)?;
    return Ok(results);
}
