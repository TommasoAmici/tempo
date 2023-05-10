APP = tempo
run:
	RUST_LOG=debug cargo run

# FRONTEND
frontend/node_modules/.install: frontend/package.json frontend/pnpm-lock.yaml
	cd frontend && pnpm install
	touch frontend/node_modules/.install

frontend/.next/cache/touchfile: frontend/node_modules/.install $(shell find frontend/src -type f)
	cd frontend && pnpm build
	touch frontend/.next/cache/touchfile

build_frontend: frontend/.next/cache/touchfile

build: build_frontend
	cargo build --release

run_release: build
	cargo run --release

db: db_create db_migrate

db_clean:
	rm -f ${APP}.db ${APP}.db-shm ${APP}.db-wal

db_create: db_clean
	sqlx database create

db_migrate:
	sqlx migrate run
