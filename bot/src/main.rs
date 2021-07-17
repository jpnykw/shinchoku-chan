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
                "記録" | "感想" | "進捗" => {
                    post(&ctx, &msg, command, args);
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
            if author.bot && author.name == "GitHub" {
                let embed = &msg.embeds[0];
                let title = &embed.title.as_ref().unwrap();
                let re = Regex::new(r"new commit").unwrap();
                let caps = re.captures(title);

                // タイトルに new commit が含まれていれば diff を取得する
                match caps {
                    Some(_) => {
                        let author = &embed.author.as_ref().unwrap().name;

                        // commit がまとめて行われていたかどうかを区別する
                        let commit_url = &embed.url.as_ref().unwrap();
                        let re = Regex::new(r"compare").unwrap();
                        let caps = re.captures(commit_url);

                        let location = match caps {
                            // まとめて行われていた場合
                            Some(_) => "compare",
                            // 1つだけの commit の場合
                            None => "commits",
                        };

                        let params = commit_url.split("/").collect::<Vec<&str>>();
                        let repo_owner = params[3];
                        let repo_name = params[4];
                        let commit_hash = params[6];

                        let fetch_url = &format!(
                            "https://api.github.com/repos/{}/{}/{}/{}",
                            repo_owner,
                            repo_name,
                            location,
                            commit_hash,
                        );

                        let access_token = env::var("GITHUB_ACCESS_TOKEN").expect("GITHUB_ACCESS_TOKEN is not found in enviroment variable!");
                        let auth = &format!("jpnykw:{}", access_token);
                        let output = Command::new("curl")
                            .args(&["-u", auth, fetch_url])
                            .output()
                            .expect("Failed to execute `curl -u ...`");

                        let result: String = String::from_utf8_lossy(&output.stdout).to_string();
                        let add_re = Regex::new(r"additions.*\d+").unwrap();
                        let del_re = Regex::new(r"deletions.*\d+").unwrap();

                        // 書き込む前に
                        // PR を merge した際に差分が記録されないように
                        // 同じ hash が既に存在していた場合は記録しない
                        let re = Regex::new(r"Merge pull request").unwrap();
                        match re.captures(&result) {
                            Some(_) => {},
                            None => {
                                let (additions, deletions): (i32, i32) = if location == "compare" {
                                    // 複数の commit が行われた場合
                                    let mut add_sum: i32 = 0;
                                    for add_caps in add_re.captures_iter(&result) {
                                        let re = Regex::new(r"\d+").unwrap();
                                        let caps = re.captures(&add_caps[0].trim()).unwrap();
                                        add_sum += caps[0].trim().parse::<i32>().unwrap();
                                    }

                                    let mut del_sum: i32 = 0;
                                    for del_caps in del_re.captures_iter(&result) {
                                        let re = Regex::new(r"\d+").unwrap();
                                        let caps = re.captures(&del_caps[0].trim()).unwrap();
                                        del_sum += caps[0].trim().parse::<i32>().unwrap();
                                    }

                                    (add_sum, del_sum)
                                } else {
                                    // 単体の commit が行われた場合
                                    let add_caps = add_re.captures(&result).unwrap();
                                    let re = Regex::new(r"\d+").unwrap();
                                    let caps = re.captures(&add_caps[0].trim()).unwrap();
                                    let add_sum = caps[0].trim().parse().unwrap();

                                    let del_caps = del_re.captures(&result).unwrap();
                                    let re = Regex::new(r"\d+").unwrap();
                                    let caps = re.captures(&del_caps[0].trim()).unwrap();
                                    let del_sum = caps[0].trim().parse().unwrap();

                                    (add_sum, del_sum)
                                };

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

                                match msg.channel_id.say(&ctx, &format!(
                                    "差分を記録したよ！\n```diff\n+ {}\n- {}\n```",
                                    additions,
                                    deletions,
                                )) {
                                    Err(e) => { dbg!(e); },
                                    Ok(_) => {},
                                };
                            },
                        };
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

