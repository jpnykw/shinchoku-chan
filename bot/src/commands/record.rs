use serenity::{
    prelude::*,
    model::prelude::*,
};

// TODO: 受け取った内容をパースしてDBに記録する
pub fn record(ctx: &Context, msg: &Message) {
    msg.channel_id.say(ctx, "まだできないよ");
}

