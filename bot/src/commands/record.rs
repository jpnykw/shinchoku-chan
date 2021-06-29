extern crate diesel;
extern crate shinchoku_chan;
use shinchoku_chan::*;

use serenity::{
    prelude::*,
    model::prelude::*,
    framework::standard::Args,
};

// TODO: 受け取った内容をパースしてDBに記録する
pub fn record(ctx: &Context, msg: &Message, args: Vec<&str>) {
    let connection = establish_connection();
    msg.channel_id.say(ctx, "DBに接続したよ");

    let name = &msg.author.name;
    let content = args.join(" ");
    msg.channel_id.say(ctx, "レコードを作成したよ");

    let post = create_post(&connection, name, &content);
    msg.channel_id.say(ctx, "DBにデータを書き込んだよ");
}

