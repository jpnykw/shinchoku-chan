use serenity::{
    prelude::*,
    model::prelude::*,
};

pub fn ping(ctx: &Context, msg: &Message) {
    msg.channel_id.say(ctx, "ぽん！");
}

