extern crate diesel;
extern crate shinchoku_chan;
use shinchoku_chan::*;

use serenity::{
    prelude::*,
    model::prelude::*,
    framework::standard::Args,
};

// DB に接続して投稿された内容を記録する
pub fn post(ctx: &Context, msg: &Message, args: Vec<&str>) {
    let connection = establish_connection();

    // TODO: 内容が空だったりした場合に処理を変える
    let name = &msg.author.name;
    let content = args.join(" ");

    let post = create_post(&connection, name, &content);
    msg.channel_id.say(ctx, "ちゃんと記録したよ！");

    println!("\n{} has write to DB with", name);
    dbg!(post);
}

pub fn show(ctx: &Context, msg: &Message) {
    // use self::schema::posts::dsl::*;
    use schema::posts::dsl::{posts};
    use diesel::prelude::*;
    use self::models::*;

    // TODO: 日時順にソートする
    let connection = establish_connection();
    // 10件を取得
    let results = posts
        .limit(10)
        .load::<Post>(&connection)
        .expect("Error loading posts");

    // テーブルのデータをコード表示にする
    let mut response = format!("```\n| {:<19} | {:<32} | {}", "Date(UTC)", "User", "Content");
    response = format!("{}\n| {:<19} | {:<32} | {}", response, "-", "-", "-");

    for post in results {
        let name = post.name;
        let mut content = post.content;
        let date = post.date.unwrap();

        let max_len = 30;
        if content.chars().count() > max_len {
            let content_subset = content.chars().enumerate().filter(|&(i, _)| i >= 0 && i < max_len).fold("".to_string(), |s, (_, c)| format!("{}{}", s, c));
            content = format!("{}...", content_subset);
        }

        response = format!("{}\n| {:<19} | {:<32} | {}", response, date, name, content);
    }

    response = format!("{}\n```", response);
    msg.channel_id.say(ctx, "テーブルの中身を表示するよ！");
    msg.channel_id.say(ctx, &response);
}
