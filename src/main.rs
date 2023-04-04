use actix_web::middleware::Logger;
use actix_web::{web, App, HttpServer};
use clap::Parser;
use env_logger::Env;
use sqlx::sqlite::SqlitePool;

mod errors;
mod handlers;
mod lib;

use handlers::{analysis, heartbeats, statusbar, users};

/// Run the Tempo web application
#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
struct Cli {
    #[arg(short = 'd', long = "db-url", default_value = "sqlite:tempo.db")]
    db_url: String,
    #[arg(short = 'p', long = "port", default_value = "8000")]
    port: u16,
    #[arg(short = 'w', long = "workers", default_value = "2")]
    workers: usize,
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let args = Cli::parse();

    env_logger::init_from_env(Env::default().default_filter_or("info"));

    // connect to SQLite DB
    let pool = SqlitePool::connect(&args.db_url)
        .await
        .expect("Failed to connect to database");

    sqlx::migrate!()
        .run(&pool)
        .await
        .expect("Migrations failed");

    HttpServer::new(move || {
        App::new() // store db pool as Data object
            .app_data(web::Data::new(pool.clone()))
            .wrap(Logger::default())
            .service(
                web::scope("/api/v1")
                    .service(handlers::health)
                    .service(
                        web::scope("/users")
                            .service(heartbeats::heartbeats)
                            .service(statusbar::statusbar)
                            .service(users::signup)
                            .service(users::login)
                            .service(users::token_generate)
                            .service(analysis::heatmap)
                            .service(analysis::branches)
                            .service(analysis::languages),
                    )
                    .service(handlers::plugins_errors),
            )
    })
    .workers(args.workers)
    .bind(("127.0.0.1", args.port))?
    .run()
    .await
}
