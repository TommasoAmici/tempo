use serde::{Deserialize, Serialize};
use sqlx::SqlitePool;

use crate::{errors::Error, handlers::analysis::FilterQueryParams};

use super::statusbar::TimePerCategory;

#[derive(Debug, Serialize, Deserialize)]
pub struct HeatmapData {
    pub day: Option<String>,
    pub value: i32,
}

pub async fn days_heatmap(
    pool: &SqlitePool,
    user_id: i64,
    params: &FilterQueryParams,
) -> Result<Vec<HeatmapData>, Error> {
    let mut conn = pool.acquire().await.map_err(|_| Error::DBFailedToConnect)?;

    let results = sqlx::query_file_as!(
        HeatmapData,
        "src/lib/queries/analysis/heatmap.sql",
        user_id,
        params.project,
        params.date_start,
        params.date_end
    )
    .fetch_all(&mut conn)
    .await
    .map_err(|_| Error::DBFailedQuery)?;

    Ok(results)
}

#[derive(Serialize, Deserialize)]
pub struct BranchesDatum {
    pub date: Option<String>,
    pub values: Option<sqlx::types::JsonValue>,
}

pub async fn branches_activity(
    pool: &SqlitePool,
    user_id: i64,
    params: &FilterQueryParams,
) -> Result<Vec<BranchesDatum>, Error> {
    let mut conn = pool.acquire().await.map_err(|_| Error::DBFailedToConnect)?;

    let results = sqlx::query_file_as!(
        BranchesDatum,
        "src/lib/queries/analysis/branches.sql",
        user_id,
        params.project,
        params.date_start,
        params.date_end
    )
    .fetch_all(&mut conn)
    .await
    .map_err(|_| Error::DBFailedQuery)?;

    Ok(results)
}

pub async fn languages_activity(
    pool: &SqlitePool,
    user_id: i64,
    params: &FilterQueryParams,
) -> Result<Vec<TimePerCategory>, Error> {
    let mut conn = pool.acquire().await.map_err(|_| Error::DBFailedToConnect)?;
    let results = sqlx::query_file_as!(
        TimePerCategory,
        "src/lib/queries/analysis/languages.sql",
        user_id,
        params.project,
        params.date_start,
        params.date_end,
    )
    .fetch_all(&mut conn)
    .await
    .map_err(|_| Error::DBFailedQuery)?;

    Ok(results)
}

pub async fn projects_activity(
    pool: &SqlitePool,
    user_id: i64,
    date_start: &Option<time::Date>,
    date_end: &Option<time::Date>,
) -> Result<Vec<TimePerCategory>, Error> {
    let mut conn = pool.acquire().await.map_err(|_| Error::DBFailedToConnect)?;
    let results = sqlx::query_file_as!(
        TimePerCategory,
        "src/lib/queries/analysis/time_per_project.sql",
        user_id,
        date_start,
        date_end,
    )
    .fetch_all(&mut conn)
    .await
    .map_err(|_| Error::DBFailedQuery)?;

    Ok(results)
}
