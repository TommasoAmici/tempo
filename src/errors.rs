use actix_web::{
    error,
    http::{header::ContentType, StatusCode},
    HttpResponse,
};
use std::fmt;

#[derive(Debug)]
pub enum Error {
    UserAlreadyExists,
    NotAuthorized,
    WrongUsernameOrPassword,
    PasswordsDontMatch,
    FailedToGenerateSalt,
    FailedToDecodeHash,
    AuthorizationMissing,
    HashMissing,
    DBFailedToConnect,
    DBFailedToInsert,
    DBFailedQuery,
}

impl fmt::Display for Error {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match *self {
            Error::AuthorizationMissing => write!(f, "Authorization header missing"),
            Error::UserAlreadyExists => write!(f, "User already exists"),
            Error::NotAuthorized => write!(f, "Not authorized"),
            Error::WrongUsernameOrPassword => write!(f, "Wrong username or password"),
            Error::PasswordsDontMatch => write!(f, "Passwords don't match"),
            Error::FailedToGenerateSalt => write!(f, "Failed to generate salt"),
            Error::FailedToDecodeHash => write!(f, "Failed to decode hash"),
            Error::HashMissing => write!(f, "Hash missing"),
            Error::DBFailedQuery => write!(f, "Database: failed to run query"),
            Error::DBFailedToConnect => write!(f, "Database: failed to connect"),
            Error::DBFailedToInsert => write!(f, "Database: failed to insert"),
        }
    }
}

impl error::ResponseError for Error {
    fn error_response(&self) -> HttpResponse {
        HttpResponse::build(self.status_code())
            .insert_header(ContentType::html())
            .body(self.to_string())
    }

    fn status_code(&self) -> StatusCode {
        match *self {
            Error::AuthorizationMissing => StatusCode::UNAUTHORIZED,
            Error::UserAlreadyExists => StatusCode::CONFLICT,
            Error::NotAuthorized => StatusCode::UNAUTHORIZED,
            Error::WrongUsernameOrPassword => StatusCode::UNAUTHORIZED,
            Error::PasswordsDontMatch => StatusCode::BAD_REQUEST,
            Error::FailedToGenerateSalt => StatusCode::INTERNAL_SERVER_ERROR,
            Error::FailedToDecodeHash => StatusCode::INTERNAL_SERVER_ERROR,
            Error::HashMissing => StatusCode::INTERNAL_SERVER_ERROR,
            Error::DBFailedQuery => StatusCode::INTERNAL_SERVER_ERROR,
            Error::DBFailedToConnect => StatusCode::INTERNAL_SERVER_ERROR,
            Error::DBFailedToInsert => StatusCode::INTERNAL_SERVER_ERROR,
        }
    }
}
