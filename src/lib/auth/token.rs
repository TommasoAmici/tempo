use regex::Regex;
use uuid::Uuid;

const PREFIX: &'static str = "waka_";

/// `generate_api_token` returns a token to authenticate requests to the `tempo` API.
///
/// The `vscode-wakatime` extension expects the API token to match a specific Regex. For
/// this reason a token is recursively generated until it matches that Regex.
pub fn generate_api_token() -> String {
    let id = Uuid::new_v4();
    let token = format!("{}{}", PREFIX, id);
    println!("{}", token);

    // This regex is copied as is from `vscode-wakatime`, if the token generated doesn't
    // match, another one will be generated until it does
    let re = Regex::new(
        r"(?i)^(waka_)?[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$",
    )
    .unwrap();
    if re.is_match(token.as_str()) {
        return token;
    } else {
        return generate_api_token();
    }
}
