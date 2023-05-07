APP = tempo
run:
	RUST_LOG=debug cargo run

target/release/${APP}:
	cargo build --release

build:
	make target/release/${APP}

run_release: build
	cargo run --release

db: db_create db_migrate

db_clean:
	rm -f ${APP}.db ${APP}.db-shm ${APP}.db-wal

db_create: db_clean
	sqlx database create

db_migrate:
	sqlx migrate run
