use crate::errors::Error;
use log::error;
use regex::Regex;
use serde::{Deserialize, Serialize};
use serde_json::json;
use sqlx::SqlitePool;
use sqlx::{QueryBuilder, Sqlite};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Heartbeat {
    pub branch: String,
    pub category: String,
    pub cursorpos: Option<i64>,
    pub dependencies: Option<Vec<String>>,
    pub entity: String,
    pub is_write: Option<bool>,
    pub language: Option<String>,
    pub lineno: Option<i64>,
    pub lines: Option<i64>,
    pub project: String,
    pub project_root_count: Option<i64>,
    pub time: f64,
    #[serde(rename = "type")]
    pub heartbeat_type: String,
    pub user_agent: String,
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

pub async fn insert_heartbeats(
    pool: &SqlitePool,
    user_id: i64,
    machine: &str,
    heartbeats: &Vec<Heartbeat>,
) -> Result<(), Error> {
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

    query.execute(pool).await.map_err(|err| {
        error!("{}", err);
        Error::DBFailedToInsert
    })?;

    Ok(())
}
