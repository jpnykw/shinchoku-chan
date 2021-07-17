extern crate diesel;
extern crate shinchoku_chan;
use shinchoku_chan::*;
use std::env;

use serenity::{
    prelude::*,
    model::prelude::*,
};

// DB に接続して投稿された内容を記録する
pub fn post(ctx: &Context, msg: &Message, tag: &str, args: Vec<&str>) {
    match msg.channel_id.say(ctx, "ちょっとだけ待ってね…") {
        Err(e) => {
            dbg!(e);
        },
        Ok(_) => {
            let connection = establish_connection();

            // TODO: 内容が空だったりした場合に処理を変える
            let name = &msg.author.name;
            let content = args.join(" ");

            create_post(&connection, name, &content, tag);
            match msg.channel_id.say(ctx, "ちゃんと記録したよ！") {
                Err(e) => { dbg!(e); },
                Ok(_) => {},
            };
        }
    };
}

pub fn show(ctx: &Context, msg: &Message) {
    use schema::posts::dsl::{date as post_date, posts};
    use diesel::prelude::*;
    use self::models::*;

    match msg.channel_id.say(ctx, "ちょっとだけ待ってね…") {
        Err(e) => {
            dbg!(e);
        },
        Ok(_) => {
            let connection = establish_connection();

            // 最新の10件を取得
            let results = posts
                .order_by(post_date.desc())
                .limit(10)
                .load::<Post>(&connection)
                .expect("Error loading posts");

            // テーブルのデータをコード表示にする
            let mut response = String::from("```\n最新の10件を取得しました\n");
            response = format!("{}\n| {:<19} | {:<20} | {}", response, "Date(UTC)", "User", "Content");
            response = format!("{}\n| {:<19} | {:<20} | {}", response, "-", "-", "-");

            for post in results {
                let mut name = post.name;
                let mut content = post.content;
                let date = post.date.unwrap();

                let max_len = 30;
                if content.chars().count() > max_len {
                    let content_subset = content.chars().enumerate().filter(|&(i, _)| i < max_len).fold("".to_string(), |s, (_, c)| format!("{}{}", s, c));
                    content = format!("{}...", content_subset);
                }

                let max_len = 20;
                if name.chars().count() > max_len {
                    let name_subset = name.chars().enumerate().filter(|&(i, _)| i < max_len).fold("".to_string(), |s, (_, c)| format!("{}{}", s, c));
                    name = format!("{}...", name_subset);
                }

                response = format!("{}\n| {:<19} | {:<20} | {}", response, date, name, content);
            }

            let deploy_link = env::var("DEPLOY_URL").expect("DEPLOY_URL is not found in enviroment variable!");

            response = format!("{}\n```\nもっと詳しく見る: <{}>", response, deploy_link);
            match msg.channel_id.say(ctx, "テーブルの中身を表示するよ！") {
                Err(e) => {
                    dbg!(e);
                },
                Ok(_) => {
                    match msg.channel_id.say(ctx, &response) {
                        Err(e) => { dbg!(e); },
                        Ok(_) => {},
                    };
                },
            };
        },
    };
}
