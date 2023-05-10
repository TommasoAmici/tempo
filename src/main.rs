use actix_web::middleware::Logger;
use actix_web::{web, App, HttpServer};
use clap::Parser;
use env_logger::Env;
use sqlx::sqlite::SqlitePool;
use tempo::handlers;

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
            .service(handlers::static_files::index)
            .service(handlers::static_files::login)
            .service(handlers::static_files::signup)
            .service(handlers::static_files::dashboard)
            .service(
                web::scope("/api/v1")
                    .service(handlers::health)
                    .service(
                        web::scope("/users")
                            .service(handlers::heartbeats::heartbeats)
                            .service(handlers::statusbar::statusbar)
                            .service(handlers::users::signup)
                            .service(handlers::users::login)
                            .service(handlers::users::token_generate)
                            .service(handlers::projects::get_user_projects)
                            .service(handlers::projects::get_project_branches)
                            .service(handlers::analysis::heatmap)
                            .service(handlers::analysis::branches)
                            .service(handlers::analysis::languages)
                            .service(handlers::analysis::languages_stream),
                    )
                    .service(handlers::plugins_errors),
            )
            .service(handlers::static_files::dist)
    })
    .workers(args.workers)
    .bind(("127.0.0.1", args.port))?
    .run()
    .await
}
