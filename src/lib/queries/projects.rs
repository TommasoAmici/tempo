use sqlx::SqlitePool;
use time::Date;

use crate::errors::Error;

pub async fn get_users_projects(
    pool: &SqlitePool,
    user_id: i64,
    date_start: &Option<Date>,
    date_end: &Option<Date>,
) -> Result<Vec<String>, Error> {
    let mut conn = pool.acquire().await.map_err(|_| Error::DBFailedToConnect)?;

    let results = sqlx::query_file_scalar!(
        "src/lib/queries/users_projects.sql",
        user_id,
        date_start,
        date_end
    )
    .fetch_all(&mut conn)
    .await
    .map_err(|_| Error::DBFailedQuery)?;
    return Ok(results);
}
