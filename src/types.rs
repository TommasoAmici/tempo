use serde::{Deserialize, Serialize};

pub type Hour = u64;
pub type Minute = u64;
pub type Second = u64;
pub type Duration = f64;

#[derive(Debug, Default, Serialize, Deserialize)]
pub struct Status {
    pub decimal: String, // "0.00"
    pub digital: String, // "00:00:00"
    pub text: String,    // "1 hour, 6 minutes, 50 seconds"
    pub hours: Hour,
    pub minutes: Minute,
    pub seconds: Second,
    pub total_seconds: Duration,

    // Optional fields
    pub machine_name_id: Option<String>, // "410bcd3a-f889-4aeb-adf3-d0b854992d8c"
    pub percent: Option<f64>,
    pub name: Option<String>,
    pub color: Option<String>,
}

type Project = Status;

type Category = Status;

type Editor = Status;

type Language = Status;

type OperatingSystem = Status;

type Machine = Status;

#[derive(Debug, Serialize, Deserialize)]
pub struct StatusbarResponseData {
    pub categories: Vec<Category>,
    pub dependencies: Vec<String>,
    pub editors: Vec<Editor>,
    pub grand_total: Status,
    pub languages: Vec<Language>,
    pub machines: Vec<Machine>,
    pub operating_systems: Vec<OperatingSystem>,
    pub projects: Vec<Project>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct StatusbarResponse {
    #[serde(with = "time::serde::iso8601")]
    pub cached_at: time::OffsetDateTime,
    pub data: StatusbarResponseData,
}
