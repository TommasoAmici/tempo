use actix_web::{web, HttpResponse, Responder};
use mime_guess::from_path;
use rust_embed::RustEmbed;

#[derive(RustEmbed)]
#[folder = "frontend/build/"]
struct Assets;

fn handle_embedded_file(path: &str) -> HttpResponse {
    match Assets::get(path) {
        Some(content) => HttpResponse::Ok()
            .content_type(from_path(path).first_or_octet_stream().as_ref())
            .body(content.data.into_owned()),
        None => handle_embedded_file("404.html"),
    }
}

#[actix_web::get("/")]
async fn index() -> impl Responder {
    handle_embedded_file("index.html")
}

#[actix_web::get("/login")]
async fn login() -> impl Responder {
    handle_embedded_file("login.html")
}

#[actix_web::get("/signup")]
async fn signup() -> impl Responder {
    handle_embedded_file("signup.html")
}

#[actix_web::get("/dashboard")]
async fn dashboard() -> impl Responder {
    handle_embedded_file("dashboard.html")
}

#[actix_web::get("/{_:.*}")]
async fn dist(path: web::Path<String>) -> impl Responder {
    handle_embedded_file(path.as_str())
}
