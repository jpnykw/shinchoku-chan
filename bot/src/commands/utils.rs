extern crate regex;

use std::process::Command;
use regex::Regex;
use std::env;

use serenity::{
    prelude::*,
    model::prelude::*,
    framework::standard::Args,
};

pub fn ping(ctx: &Context, msg: &Message) {
    msg.channel_id.say(ctx, "ぽん！");
}

pub fn heroku_ps(ctx: &Context, msg: &Message, args: Vec<&str>) {
    msg.channel_id.say(ctx, "ちょっとだけ待ってね…");
    let output = Command::new("heroku")
        .args(&["ps"])
        .output()
        .expect("Failed to execute `heroku ps`");

    let mut result: String = String::from_utf8_lossy(&output.stdout).to_string();
    let mut lang = "r";

    result = match if args.len() > 0 { args[0] } else { "" } {
        // 表示方法が指定されていた場合はそのまま表示する
        "full" | "detail" => result,
        // それ以外はステータスだけを表示する
        _ => {
            lang = "fix";
            let re = Regex::new(r"web.\d:(.[^\d]+)\d").unwrap();
            let caps = re.captures(&result).unwrap();
            format!("status: {}", &caps[1].trim())
        }
    };

    msg.channel_id.say(ctx, &format!("heroku の様子だよ！\n```{}\n{}\n```", lang, result));
}

pub fn fetch_issue(ctx: &Context, msg: &Message) {
    msg.channel_id.say(ctx, "少しだけ待ってね…");
    let access_token = env::var("GITHUB_ACCESS_TOKEN").expect("GITHUB_ACCESS_TOKEN is not found in enviroment variable!");
    let output = Command::new("curl")
        .args(&[
            "-u",
            &format!("jpnykw:{}", access_token),
            "https://api.github.com/repos/jpnykw/shinchoku-chan/issues",
        ])
        .output()
        .expect("Failed to execute `curl -u ...`");

    let mut result: String = String::from_utf8_lossy(&output.stdout).to_string();
    msg.channel_id.say(ctx, "どん！");

    let re = Regex::new(r".title.:.+,").unwrap();
    let caps: Vec<String> = re.find_iter(&result)
        .filter_map(|digits| digits.as_str().parse().ok())
        .collect();

    let mut display: String = String::from("```json\n{");
    for title in caps.iter() { display = format!("{}\n\t{}", display, title) }
    msg.channel_id.say(ctx, &format!("{}\n{}```", display, "}"));
}

