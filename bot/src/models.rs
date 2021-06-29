use crate::schema::posts;
use chrono::naive::NaiveDateTime;

#[derive(Queryable, Debug)]
pub struct Post {
    pub id: i32,
    pub name: String,
    pub content: String,
    pub date: Option<chrono::NaiveDateTime>,
}

#[derive(Insertable)]
#[table_name = "posts"]
pub struct NewPost<'a> {
    pub name: &'a str,
    pub content: &'a str,
    pub date: NaiveDateTime,
}

