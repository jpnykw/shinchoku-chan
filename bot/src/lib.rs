#[macro_use]
extern crate diesel;
extern crate dotenv;

use diesel::prelude::*;
use dotenv::dotenv;
use chrono::Utc;
use std::env;

pub mod models;
pub mod schema;
use self::models::{NewPost, Post};

// DBに接続するための処理
pub fn establish_connection() -> MysqlConnection {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL is not found in enviroment variable!");
    MysqlConnection::establish(&database_url).expect(&format!("Failed connecting to {}", database_url))
}

// DBにデータを書き込むための処理
pub fn create_post(conn: &MysqlConnection, name: &str, content: &str) -> Post {
    use schema::posts::dsl::{ id, posts };

    let date = chrono::Utc::now().naive_utc();
    let new_post = NewPost { name, content, date };

    diesel::insert_into(posts)
        .values(&new_post)
        .execute(conn)
        .expect("Error saving new post");

    posts.order(id.desc()).first(conn).unwrap()
}
