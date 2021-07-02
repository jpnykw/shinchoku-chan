use std::env;

use serenity::{
    prelude::*,
    model::{channel::Message, gateway::Ready},
};

mod commands;
use commands::{
    utils::*,
    db::*,
};

struct Handler {
    prefix: String
}

// Botがコマンドを解釈して実行する処理
impl EventHandler for Handler {
    fn message(&self, ctx: Context, msg: Message) {
        let content = &msg.content;
        if content.starts_with(&self.prefix) {
            let tokens = &content[self.prefix.len()..];
            let mut tokens = tokens.split_whitespace();
            let command = tokens.next().expect("Unwrap command name.");
            let args = tokens.collect::<Vec<&str>>();

            match command {
                "ping" => {
                    ping(&ctx, &msg);
                },
                "記録" | "感想" | "進捗" | "今日の感想" => {
                    post(&ctx, &msg, args);
                },
                "表示" => {
                    show(&ctx, &msg);
                },
                "heroku" | "へろく" => {
                    heroku_ps(&ctx, &msg, args);
                },
                "タスク" => {
                    fetch_issue(&ctx, &msg);
                }
                _ => {
                    if let Err(why) = msg.channel_id.say(&ctx.http, &format!("`{}` ってなんのこと？", command)) {
                        println!("Error sending message: {:?}", why);
                    }
                },
            }
        }
    }

    fn ready(&self, _: Context, ready: Ready) {
        println!("Ready setup {}!", ready.user.name);
    }
}

fn main() {
    let header = Handler{ prefix: "<@!859396354328756255>".to_string() };
    let token = env::var("DISCORD_BOT_TOKEN").expect("Token is not found in enviroment variable!");
    let mut client = Client::new(&token, header).expect("Err creating client");
    if let Err(why) = client.start() {
        println!("Error start client: {:?}", why);
    }
}

