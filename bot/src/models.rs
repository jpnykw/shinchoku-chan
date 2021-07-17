use crate::schema::posts;
use crate::schema::commits;
use chrono::naive::NaiveDateTime;

// 進捗や記録を保存するためのテーブル
#[derive(Queryable, Debug)]
pub struct Post {
    pub id: i32,
    pub name: String,
    pub content: String,
    pub tag: String,
    pub date: Option<NaiveDateTime>,
}

#[derive(Insertable)]
#[table_name = "posts"]
pub struct NewPost<'a> {
    pub name: &'a str,
    pub content: &'a str,
    pub tag: &'a str,
    pub date: NaiveDateTime,
}

// commit の変更料 (差分) を保存するためのテーブル
#[derive(Queryable, Debug)]
pub struct Commit {
    pub id: i32,
    pub user: String,
    pub additions: i32,
    pub deletions: i32,
    pub hash: String,
    pub repo_owner: String,
    pub repo_name: String,
    pub date: Option<NaiveDateTime>,
}

#[derive(Insertable)]
#[table_name = "commits"]
pub struct NewCommit<'a> {
    pub user: &'a str,
    pub additions: &'a i32,
    pub deletions: &'a i32,
    pub hash: &'a str,
    pub repo_owner: &'a str,
    pub repo_name: &'a str,
    pub date: NaiveDateTime,
}

