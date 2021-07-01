extern crate regex;

use serenity::{
    prelude::*,
    model::prelude::*,
    framework::standard::Args,
};

pub fn ping(ctx: &Context, msg: &Message) {
    msg.channel_id.say(ctx, "ぽん！");
}

pub fn heroku_ps(ctx: &Context, msg: &Message, args: Vec<&str>) {
    use std::process::Command;
    use regex::Regex;

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
