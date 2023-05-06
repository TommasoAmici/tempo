use sqlx::SqlitePool;
use time::Date;

use crate::errors::Error;

/// Get all projects for a user
/// If date_start and date_end are provided, only projects with heartbeats in that range will be returned
pub async fn get_users_projects(
    pool: &SqlitePool,
    user_id: i64,
    date_start: &Option<Date>,
    date_end: &Option<Date>,
) -> Result<Vec<String>, Error> {
    let results = sqlx::query_file_scalar!(
        "src/lib/queries/users_projects.sql",
        user_id,
        date_start,
        date_end
    )
    .fetch_all(pool)
    .await
    .map_err(|_| Error::DBFailedQuery)?;
    return Ok(results);
}

/// Get all branches for a user's project
/// If date_start and date_end are provided, only branches with heartbeats in that range will be returned
pub async fn get_project_branches(
    pool: &SqlitePool,
    user_id: i64,
    project: &String,
    date_start: &Option<Date>,
    date_end: &Option<Date>,
) -> Result<Vec<String>, Error> {
    let results = sqlx::query_file_scalar!(
        "src/lib/queries/users_project_branches.sql",
        user_id,
        project,
        date_start,
        date_end
    )
    .fetch_all(pool)
    .await
    .map_err(|_| Error::DBFailedQuery)?;
    return Ok(results);
}
