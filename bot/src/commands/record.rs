use std::env;

use serenity::{
    prelude::*,
    model::prelude::*,
};

use diesel::mysql::MysqlConnection;
use diesel::prelude::*;
use dotenv::dotenv;

fn establish_connection() -> MysqlConnection {
    let database_url = env::var("DB_URL").expect("DB_URL is not found in enviroment variable!");
    MysqlConnection::establish(&database_url).expect(&format!("Failed connecting to {}", database_url))
}

// TODO: 受け取った内容をパースしてDBに記録する
pub fn record(ctx: &Context, msg: &Message) {
    let connection: MysqlConnection = establish_connection();
    msg.channel_id.say(ctx, "DBへの接続に成功したよ");
}

