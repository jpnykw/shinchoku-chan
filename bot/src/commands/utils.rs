extern crate regex;

use std::process::Command;
use regex::Regex;

use serenity::{
    prelude::*,
    model::prelude::*,
};

pub fn ping(ctx: &Context, msg: &Message) {
    match msg.channel_id.say(ctx, "ぽん！") {
        Err(e) => { dbg!(e); },
        Ok(_) => {},
    };
}

pub fn heroku_ps(ctx: &Context, msg: &Message, args: Vec<&str>) {
    match msg.channel_id.say(ctx, "ちょっとだけ待ってね…") {
        Err(e) => {
            dbg!(e);
        },
        Ok(_) => {
            let output = Command::new("heroku")
                .args(&["ps"])
                .output()
                .expect("Failed to execute `heroku ps`");

            let mut lang = "r";
            let mut result: String = String::from_utf8_lossy(&output.stdout).to_string();

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

            match msg.channel_id.say(ctx, &format!("heroku の様子だよ！\n```{}\n{}\n```", lang, result)) {
                Err(e) => { dbg!(e); },
                Ok(_) => {},
            };
        },
    };
}

