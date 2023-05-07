use actix_web::{post, web, Error as AWError, HttpRequest, HttpResponse};
use log::error;
use regex::Regex;
use serde::{Deserialize, Serialize};
use serde_json::json;
use sqlx::SqlitePool;
use sqlx::{QueryBuilder, Sqlite};

use crate::errors::Error;
use crate::lib::auth::parse_header::user_id_from_authorization_header;

#[derive(Debug, Serialize, Deserialize)]
struct Heartbeat {
    branch: String,
    category: String,
    cursorpos: Option<i64>,
    dependencies: Option<Vec<String>>,
    entity: String,
    is_write: Option<bool>,
    language: Option<String>,
    lineno: Option<i64>,
    lines: i64,
    project: String,
    project_root_count: Option<i64>,
    time: f64,
    #[serde(rename = "type")]
    heartbeat_type: String,
    user_agent: String,
}

/// Returns the value of the HTTP header if available. Otherwise it returns the
/// `default` value.
fn get_header_or_default<'a>(req: &'a HttpRequest, header: &'a str, default: &'a str) -> &'a str {
    req.headers()
        .get(header)
        .and_then(|value| value.to_str().ok())
        .unwrap_or(default)
}

/// Returns the OS name from a user agent string if available, otherwise it returns
/// an empty string
fn get_os_from_user_agent(user_agent: &str) -> String {
    let re = Regex::new(r"\((.+)\)").unwrap();
    for cap in re.captures_iter(user_agent) {
        return cap[1].to_string();
    }
    return String::from("");
}

#[derive(Debug, Serialize, Deserialize)]
struct HeartbeatResponse {
    pub responses: Vec<Vec<Option<i64>>>,
}

#[post("/current/heartbeats.bulk")]
async fn heartbeats(
    req: HttpRequest,
    db: web::Data<SqlitePool>,
    heartbeats: web::Json<Vec<Heartbeat>>,
) -> Result<HttpResponse, AWError> {
    let user_id = user_id_from_authorization_header(&req, &db).await?;
    let machine = get_header_or_default(&req, "X-Machine-Name", "");

    let mut query_builder: QueryBuilder<Sqlite> = QueryBuilder::new(
        "INSERT INTO heartbeats (
            user_id,
            branch,
            category,
            cursorpos,
            dependencies,
            entity,
            is_write,
            language,
            lineno,
            lines,
            project,
            project_root_count,
            time,
            type,
            user_agent,
            machine,
            operating_system
        ) ",
    );
    query_builder.push_values(heartbeats.iter(), |mut b, hb| {
        let dependencies = match &hb.dependencies {
            Some(deps) => json!(deps),
            None => json!(vec![""; 0]),
        };

        b.push_bind(user_id)
            .push_bind(&hb.branch)
            .push_bind(&hb.category)
            .push_bind(hb.cursorpos)
            .push_bind(dependencies)
            .push_bind(&hb.entity)
            .push_bind(match hb.is_write {
                Some(x) => x,
                None => false,
            })
            .push_bind(match &hb.language {
                Some(x) => x.into(),
                None => String::from(""),
            })
            .push_bind(hb.lineno)
            .push_bind(hb.lines)
            .push_bind(&hb.project)
            .push_bind(hb.project_root_count)
            .push_bind(hb.time)
            .push_bind(&hb.heartbeat_type)
            .push_bind(&hb.user_agent)
            .push_bind(machine)
            .push_bind(get_os_from_user_agent(&hb.user_agent));
    });
    let query = query_builder.build();
    let mut conn = db.acquire().await.map_err(|_| Error::DBFailedToConnect)?;

    query.execute(&mut conn).await.map_err(|err| {
        error!("{}", err);
        Error::DBFailedToInsert
    })?;

    Ok(HttpResponse::Accepted().json(json!(HeartbeatResponse {
        responses: heartbeats.iter().map(|_| vec![None, Some(201)]).collect()
    })))
}
