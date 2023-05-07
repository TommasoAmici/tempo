use std::result;

use serde::{Deserialize, Serialize};
use sqlx::SqlitePool;
use time::Date;

use crate::{errors::Error, handlers::analysis::FilterQueryParams};

use super::statusbar::TimePerCategory;

time::serde::format_description!(serde_date_format, Date, "[year]-[month]-[day]");

#[derive(Debug, Serialize, Deserialize)]
pub struct HeatmapData {
    #[serde(with = "serde_date_format::option")]
    pub day: Option<Date>,
    pub value: i32,
}

pub async fn days_heatmap(
    pool: &SqlitePool,
    user_id: i64,
    params: &FilterQueryParams,
) -> Result<Vec<HeatmapData>, Error> {
    let results = sqlx::query_file_as!(
        HeatmapData,
        "src/lib/queries/analysis/heatmap.sql",
        user_id,
        params.project,
        params.branch,
        params.date_start,
        params.date_end
    )
    .fetch_all(pool)
    .await
    .map_err(|_| Error::DBFailedQuery)?;

    Ok(results)
}

#[derive(Serialize, Deserialize)]
pub struct BranchesDatum {
    #[serde(with = "serde_date_format::option")]
    pub date: Option<Date>,
    pub values: Option<sqlx::types::JsonValue>,
}

pub async fn branches_activity(
    pool: &SqlitePool,
    user_id: i64,
    params: &FilterQueryParams,
) -> Result<Vec<BranchesDatum>, Error> {
    let results = sqlx::query_file_as!(
        BranchesDatum,
        "src/lib/queries/analysis/branches.sql",
        user_id,
        params.project,
        params.branch,
        params.date_start,
        params.date_end
    )
    .fetch_all(pool)
    .await
    .map_err(|_| Error::DBFailedQuery)?;

    Ok(results)
}

pub async fn languages_activity(
    pool: &SqlitePool,
    user_id: i64,
    params: &FilterQueryParams,
) -> Result<Vec<TimePerCategory>, Error> {
    let results = sqlx::query_file_as!(
        TimePerCategory,
        "src/lib/queries/analysis/languages.sql",
        user_id,
        params.project,
        params.branch,
        params.date_start,
        params.date_end,
    )
    .fetch_all(pool)
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
    let results = sqlx::query_file_as!(
        TimePerCategory,
        "src/lib/queries/analysis/time_per_project.sql",
        user_id,
        date_start,
        date_end,
    )
    .fetch_all(pool)
    .await
    .map_err(|_| Error::DBFailedQuery)?;

    Ok(results)
}

#[derive(sqlx::FromRow)]
pub struct LanguageStream {
    pub language: String,
    pub date: Date,
    pub count: i32,
}

pub async fn languages_stream(
    pool: &SqlitePool,
    user_id: i64,
    params: &FilterQueryParams,
) -> Result<Vec<LanguageStream>, Error> {
    let results = sqlx::query_as::<_, LanguageStream>(
        r#"
        WITH RECURSIVE past_year_dates("date") AS (
            VALUES(COALESCE(?4, DATE('now', '-1 month')))
            UNION ALL
            SELECT CASE
                    WHEN JULIANDAY(COALESCE(?5, DATE('now'))) - JULIANDAY(COALESCE(?4, DATE('now', '-1 year'))) > 15 THEN date("date", '+1 day', 'weekday 1')
                    ELSE date("date", '+1 day')
                END AS "date"
            FROM past_year_dates
            WHERE "date" < COALESCE(?5, DATE('now'))
        ),
        all_languages AS (
            SELECT DISTINCT h."language"
            FROM heartbeats h
            WHERE user_id = ?1
                AND h."project" = COALESCE(?2, h."project")
                AND h."branch" = COALESCE(?3, h."branch")
                AND h."language" != ''
                AND DATE(h."time", 'unixepoch') >= COALESCE(?4, DATE(h."time", 'unixepoch'))
                AND DATE(h."time", 'unixepoch') <= COALESCE(?5, DATE(h."time", 'unixepoch'))
            GROUP BY h."language"
            ORDER BY COUNT(*) DESC
            LIMIT 10
        ), all_languages_dates AS (
            SELECT p."date" AS "date",
                a."language" AS "language"
            FROM all_languages a
                CROSS JOIN past_year_dates p
        ),
        language_stream_cte AS (
            SELECT h."language",
                CASE
                    WHEN JULIANDAY(COALESCE(?5, DATE('now'))) - JULIANDAY(COALESCE(?4, DATE('now', '-1 year'))) > 15 THEN DATE(h."time", 'unixepoch', 'weekday 1')
                    ELSE DATE(h."time", 'unixepoch')
                END AS "date",
                COUNT(*) AS "count"
            FROM heartbeats h
            WHERE user_id = ?1
                AND h."project" = COALESCE(?2, h."project")
                AND h."branch" = COALESCE(?3, h."branch")
                AND DATE(h."time", 'unixepoch') >= COALESCE(?4, DATE(h."time", 'unixepoch'))
                AND DATE(h."time", 'unixepoch') <= COALESCE(?5, DATE(h."time", 'unixepoch'))
            GROUP BY h."language",
                "date"
        )
        SELECT a."date" AS "date",
            a."language" AS "language",
            l."count" AS "count"
        FROM all_languages_dates a
            LEFT JOIN language_stream_cte l ON a."date" = l."date"
            AND a."language" = l."language"
        ORDER BY "language",
            "date";
"#,
    )
    .bind(user_id)
    .bind(&params.project)
    .bind(&params.branch)
    .bind(params.date_start)
    .bind(params.date_end)
    .bind(params.sensitivity)
    .fetch_all(pool)
    .await
    .map_err(|e| {
        log::error!("Failed to query languages stream: {}", e);
        Error::DBFailedQuery
    });

    // TODO: use this query when sqlx supports it
    // https://github.com/launchbadge/sqlx/issues/2465

    // let results = sqlx::query_file_as_unchecked!(
    //     LanguageStream,
    //     "src/lib/queries/analysis/languages_stream.sql",
    //     user_id,
    //     params.project,
    //     params.branch,
    //     params.date_start,
    //     params.date_end,
    //     params.sensitivity,
    // )
    // .fetch_all(pool)
    // .await
    // .map_err(|_| Error::DBFailedQuery)?;

    results
}
