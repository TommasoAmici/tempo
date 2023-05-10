use std::num::NonZeroU32;

use ring::rand::SecureRandom;
use ring::{digest, pbkdf2, rand};

use crate::errors::Error;

static PBKDF2_ALG: pbkdf2::Algorithm = pbkdf2::PBKDF2_HMAC_SHA512;
static ITERATIONS: u32 = 480_000;
const CREDENTIAL_LEN: usize = digest::SHA512_OUTPUT_LEN;

pub fn hash_password(password: &String) -> Result<String, Error> {
    let rng = rand::SystemRandom::new();
    let mut salt = [0u8; CREDENTIAL_LEN];
    rng.fill(&mut salt)
        .map_err(|_| Error::FailedToGenerateSalt)?;

    let mut pbkdf2_hash = [0u8; CREDENTIAL_LEN];
    pbkdf2::derive(
        PBKDF2_ALG,
        NonZeroU32::new(ITERATIONS).unwrap(),
        &salt,
        password.as_bytes(),
        &mut pbkdf2_hash,
    );

    Ok(format!(
        "{}:{}",
        hex::encode(salt),
        hex::encode(pbkdf2_hash)
    ))
}

pub fn verify_password(password: &String, hashed: &String) -> Result<bool, Error> {
    match hashed.split_once(":") {
        Some((salt_, hash_)) => {
            let mut salt = [0u8; CREDENTIAL_LEN];
            hex::decode_to_slice(salt_, &mut salt).map_err(|_| Error::FailedToDecodeHash)?;

            let mut hash = [0u8; CREDENTIAL_LEN];
            hex::decode_to_slice(hash_, &mut hash).map_err(|_| Error::FailedToDecodeHash)?;

            pbkdf2::verify(
                PBKDF2_ALG,
                NonZeroU32::new(ITERATIONS).unwrap(),
                &salt,
                password.as_bytes(),
                &hash,
            )
            .map_err(|_| Error::WrongUsernameOrPassword)?;
        }
        None => return Err(Error::HashMissing),
    }
    return Ok(true);
}
