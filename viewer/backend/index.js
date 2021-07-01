const password = process.env.PASSWORD;
const port = process.env.PORT || 8080;

const mysql = require('mysql');

// DB に接続する処理 heroku 上で実行する都合上 pooling を行わないと
// タイムアウトしてアプリケーションが停止してしまうので注意
const pool = mysql.createPool({
  host: 'us-cdbr-east-04.cleardb.com',
  user: 'b529d6a4aa7138',
  database: 'heroku_29a6a27e7069b46',
  password,
});

const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, '../frontend/build')));

// テーブルの値を全て取得するためのエンドポイント
app.get('/api', (_, response) => {
  pool.getConnection((_, connection) => {
    connection.query('SELECT * FROM posts ORDER BY date DESC LIMIT 50', (_, result) => {
      response.json({ result: JSON.stringify(result) });
    });
  });
});

app.get('*', (_, response) => {
  response.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

app.listen(port, () => console.log(`Listening on localhost:${port}`));
