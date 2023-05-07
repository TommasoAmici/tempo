use sqlx::SqlitePool;

use crate::errors::Error;

pub struct TimePerCategory {
    pub name: String,
    pub time_spent: Option<f64>,
    pub time_percentage: Option<f64>,
}

pub async fn get_time_per_project(
    pool: &SqlitePool,
    user_id: i64,
) -> Result<Vec<TimePerCategory>, Error> {
    let mut conn = pool.acquire().await.map_err(|_| Error::DBFailedToConnect)?;

    let results = sqlx::query_file_as!(
        TimePerCategory,
        "src/lib/queries/time_per_project.sql",
        user_id,
    )
    .fetch_all(&mut conn)
    .await
    .map_err(|_| Error::DBFailedQuery)?;
    return Ok(results);
}

pub async fn get_time_per_language(
    pool: &SqlitePool,
    user_id: i64,
) -> Result<Vec<TimePerCategory>, Error> {
    let mut conn = pool.acquire().await.map_err(|_| Error::DBFailedToConnect)?;

    let results = sqlx::query_file_as!(
        TimePerCategory,
        "src/lib/queries/time_per_language.sql",
        user_id,
    )
    .fetch_all(&mut conn)
    .await
    .map_err(|_| Error::DBFailedQuery)?;
    return Ok(results);
}

pub async fn get_time_per_branch(
    pool: &SqlitePool,
    user_id: i64,
) -> Result<Vec<TimePerCategory>, Error> {
    let mut conn = pool.acquire().await.map_err(|_| Error::DBFailedToConnect)?;

    let results = sqlx::query_file_as!(
        TimePerCategory,
        "src/lib/queries/time_per_branch.sql",
        user_id,
    )
    .fetch_all(&mut conn)
    .await
    .map_err(|_| Error::DBFailedQuery)?;
    return Ok(results);
}
