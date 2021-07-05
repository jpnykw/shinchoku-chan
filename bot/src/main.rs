extern crate regex;
extern crate shinchoku_chan;

use shinchoku_chan::*;
use std::process::Command;
use regex::Regex;
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
        let author = &msg.author;

        // コマンドだったらコマンドとして解釈する
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
                _ => {
                    if let Err(why) = msg.channel_id.say(&ctx.http, &format!("`{}` ってなんのこと？", command)) {
                        println!("Error sending message: {:?}", why);
                    }
                },
            }
        } else {
            // GitHub Bot のメッセージをキャッチする
            if (author.bot && author.name == "GitHub") {
                let embed = &msg.embeds[0];
                let title = &embed.title.as_ref().unwrap();
                let re = Regex::new(r"new commit").unwrap();
                let caps = re.captures(title);

                // タイトルに new commit が含まれていれば diff を取得する
                match caps {
                    Some(_) => {
                        let commit_url = &embed.url.as_ref().unwrap();
                        let author = &embed.author.as_ref().unwrap().name;

                        let params = commit_url.split("/").collect::<Vec<&str>>();
                        let repo_owner = params[3];
                        let repo_name = params[4];
                        let commit_hash = params[6];
 
                        let fetch_url = &format!(
                            "https://api.github.com/repos/{}/{}/commits/{}",
                            repo_owner,
                            repo_name,
                            commit_hash,
                        );

                        let access_token = env::var("GITHUB_ACCESS_TOKEN").expect("GITHUB_ACCESS_TOKEN is not found in enviroment variable!");
                        let auth = &format!("jpnykw:{}", access_token);
                        let output = Command::new("curl")
                            .args(&["-u", auth, fetch_url])
                            .output()
                            .expect("Failed to execute `curl -u ...`");

                        let result: String = String::from_utf8_lossy(&output.stdout).to_string();
 
                        let re = Regex::new(r"additions.*\d+").unwrap();
                        let caps = re.captures(&result).unwrap();
                        let re = Regex::new(r"\d+").unwrap();
                        let caps = re.captures(&caps[0].trim()).unwrap();
                        let additions: i32 = caps[0].trim().parse().unwrap();

                        let re = Regex::new(r"deletions.*\d+").unwrap();
                        let caps = re.captures(&result).unwrap();
                        let re = Regex::new(r"\d+").unwrap();
                        let caps = re.captures(&caps[0].trim()).unwrap();
                        let deletions: i32 = caps[0].trim().parse().unwrap();

                        // TODO: 差分を DB に記録する
                        let connection = establish_connection();
                        create_commit(
                            &connection,
                            author,
                            &additions,
                            &deletions,
                            commit_hash,
                            repo_owner,
                            repo_name,
                        );

                        msg.channel_id.say(&ctx, &format!(
                            "差分を記録したよ！\n```diff\n+ {}\n- {}\n```",
                            additions,
                            deletions,
                        ));
                    },
                    None => {},
                };
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

