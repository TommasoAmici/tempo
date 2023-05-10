use crate::queries::heartbeats::insert_heartbeats;
use crate::{
    auth::parse_header::user_id_from_authorization_header, queries::heartbeats::Heartbeat,
};
use actix_web::{post, web, Error as AWError, HttpRequest, HttpResponse};
use serde::{Deserialize, Serialize};
use serde_json::json;
use sqlx::SqlitePool;

/// Returns the value of the HTTP header if available. Otherwise it returns the
/// `default` value.
fn get_header_or_default<'a>(req: &'a HttpRequest, header: &'a str, default: &'a str) -> &'a str {
    req.headers()
        .get(header)
        .and_then(|value| value.to_str().ok())
        .unwrap_or(default)
}

#[derive(Debug, Serialize, Deserialize)]
struct HeartbeatResponse {
    pub responses: Vec<Vec<Option<i64>>>,
}

#[post("/current/heartbeats.bulk")]
async fn heartbeats(
    req: HttpRequest,
    pool: web::Data<SqlitePool>,
    heartbeats: web::Json<Vec<Heartbeat>>,
) -> Result<HttpResponse, AWError> {
    let user_id = user_id_from_authorization_header(&req, &pool).await?;
    let machine = get_header_or_default(&req, "X-Machine-Name", "");

    insert_heartbeats(&pool, user_id, machine, &heartbeats).await?;

    Ok(HttpResponse::Accepted().json(json!(HeartbeatResponse {
        responses: heartbeats.iter().map(|_| vec![None, Some(201)]).collect()
    })))
}
