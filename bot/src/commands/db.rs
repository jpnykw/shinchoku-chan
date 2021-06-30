extern crate diesel;
extern crate shinchoku_chan;
use shinchoku_chan::*;

use serenity::{
    prelude::*,
    model::prelude::*,
    framework::standard::Args,
};

pub fn record(ctx: &Context, msg: &Message, args: Vec<&str>) {
    let connection = establish_connection();

    let name = &msg.author.name;
    let content = args.join(" ");

    let post = create_post(&connection, name, &content);
    msg.channel_id.say(ctx, "ちゃんと記録したよ！");

    println!("\n{} has write to DB with", name);
    dbg!(post);
}

