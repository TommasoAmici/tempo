use actix_web::{post, route, HttpResponse, Responder};

pub mod analysis;
pub mod heartbeats;
pub mod projects;
pub mod static_files;
pub mod statusbar;
pub mod users;

#[post("/plugins/errors")]
pub async fn plugins_errors() -> impl Responder {
    // returns a 201 but doesn't actually store the errors
    HttpResponse::Created()
}

/// The `/health` endpoint should return a 200 if the app is healthy. It can be used for
/// healthchecks.
#[route("/health", method = "GET", method = "HEAD")]
pub async fn health() -> impl Responder {
    HttpResponse::Ok()
}
