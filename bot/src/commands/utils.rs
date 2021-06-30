use serenity::{
    prelude::*,
    model::prelude::*,
};

pub fn ping(ctx: &Context, msg: &Message) {
    msg.channel_id.say(ctx, "ぽん！");
}

pub fn heroku_ps(ctx: &Context, msg: &Message) {
    use std::process::Command;
    msg.channel_id.say(ctx, "ちょっとだけ待ってね…");

    let output = Command::new("heroku")
        .args(&["ps"])
        .output()
        .expect("Failed to execute `heroku ps`");

    let result = String::from_utf8_lossy(&output.stdout);
    msg.channel_id.say(ctx, &format!("heroku の様子だよ！\n```r\n{}\n```", result));
}
