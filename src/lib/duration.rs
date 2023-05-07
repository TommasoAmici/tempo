use crate::lib::types::{Duration, Hour, Minute, Second, Status};

fn hours_from_seconds(duration: Duration) -> Hour {
    (duration / 3600.0).round() as Hour
}

fn minutes_from_seconds(duration: Duration) -> Minute {
    ((duration % 3600.0) / 60.0).round() as Minute
}

fn seconds_from_seconds(duration: Duration) -> Second {
    ((duration % 3600.0) % 60.0).round() as Second
}

fn pluralize(value: u64, singular: &str, plural: &str) -> String {
    if value <= 0 {
        return String::from("");
    }
    if value == 1 {
        return format!("{} {}", value, singular);
    } else {
        return format!("{} {}", value, plural);
    }
}

fn format_duration(h: Hour, m: Minute, s: Second) -> (String, String) {
    let h_display = pluralize(h, "hour, ", "hours, ");
    let m_display = pluralize(m, "minute, ", "minutes, ");
    let s_display = pluralize(s, "second", "seconds");
    return (
        format!("{}{}{}", h_display, m_display, s_display),
        format!("{:0>2}:{:0>2}:{:0>2}", h, m, s),
    );
}

pub fn duration_status(duration: Duration) -> Status {
    let hours = hours_from_seconds(duration);
    let minutes = minutes_from_seconds(duration);
    let seconds = seconds_from_seconds(duration);
    let (text, digital) = format_duration(hours, minutes, seconds);
    let decimal = format!("{:.2}", duration / 3600.0);

    Status {
        decimal,
        digital,
        hours,
        minutes,
        text,
        seconds,
        total_seconds: duration,
        machine_name_id: None,
        percent: None,
        name: None,
        color: None,
    }
}

#[test]
fn test_hours_from_seconds() {
    assert_eq!(hours_from_seconds(3700.00), 1);
}

#[test]
fn test_minutes_from_seconds() {
    assert_eq!(minutes_from_seconds(3700.00), 2);
}

#[test]
fn test_seconds_from_seconds() {
    assert_eq!(seconds_from_seconds(3700.00), 40);
}

#[test]
fn test_format_duration() {
    let (text, digital) = format_duration(1, 1, 1);
    assert_eq!(text, "1 hour, 1 minute, 1 second");
    assert_eq!(digital, "01:01:01");

    let (text, digital) = format_duration(1, 2, 40);
    assert_eq!(text, "1 hour, 2 minutes, 40 seconds");
    assert_eq!(digital, "01:02:40");

    let (text, digital) = format_duration(3, 2, 40);
    assert_eq!(text, "3 hours, 2 minutes, 40 seconds");
    assert_eq!(digital, "03:02:40");

    let (text, digital) = format_duration(0, 2, 40);
    assert_eq!(text, "2 minutes, 40 seconds");
    assert_eq!(digital, "00:02:40");
}
