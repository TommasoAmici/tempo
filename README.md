# Tempo

>**Time**: the indefinite continued progress of existence and events in the past, present,
>and future

This is a, currently, minimal implementation of a Wakatime compatible API.

It supports creating users, generating API tokens and recording heartbeats in the database.

It also partially implements the status bar endpoint.

This project is definitely not feature complete, so if you found this while looking for
a self-hostable backend compatible with Wakatime plugins, check out
[Hakatime](https://github.com/mujx/hakatime) and [Wakapi](https://github.com/muety/wakapi)
in the meantime.

## User guide

First checkout this repository.

### Initialize database

Tempo is built for usage with Sqlite3. You can initialize a database with `make db`. This
command will create a database named `tempo.db` and apply the required migrations.

### Build and run Rust application

Build the application with `cargo build --release`.

You can then run the app with the following command:

```sh
./target/release/tempo
```

By default the app runs on port 8000, but you can configure it by setting the `-p/--port`
flag. For all options check the `--help` menu with

```sh
./target/release/tempo --help
```

### Update .wakatime.cfg

```toml
[settings]
status_bar_enabled = true
# the api_key will be generated on sign up
api_key = "waka_XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
api_url = "http://127.0.0.1:8000/api/v1/users/current/heartbeats.bulk"
```

### Signup

Since there is no frontend yet, you will have to send a request with a JSON body
containing `email`, `password`. For example, using

```sh
curl -X POST -H "Content-Type: application/json" -d '{"email":"XXX", "password":"XXX"}' http://localhost:8000/api/v1/users/signup
# or with httpie
http --json http://localhost:8000/api/v1/users/signup email=XXX password=XXX
```

### Login

You can login by sending a JSON body with `email` and `password`. The response will
return the API token you need to authorize your requests to the API

```sh
curl -X POST -H "Content-Type: application/json" -d '{"email":"XXX", "password":"XXX"}' http://localhost:8000/api/v1/users/login
# or with httpie
http --json http://localhost:8000/api/v1/users/login email=XXX password=XXX
```
