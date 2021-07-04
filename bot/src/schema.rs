table! {
    commits (id) {
        id -> Integer,
        user -> Text,
        additions -> Integer,
        deletions -> Integer,
        hash -> Text,
        repo_owner -> Text,
        repo_name -> Text,
        date -> Nullable<Datetime>,
    }
}

table! {
    posts (id) {
        id -> Integer,
        name -> Varchar,
        content -> Text,
        date -> Nullable<Datetime>,
    }
}

allow_tables_to_appear_in_same_query!(
    commits,
    posts,
);
