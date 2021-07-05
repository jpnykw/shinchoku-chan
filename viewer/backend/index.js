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

// 指定したテーブルの値を取得する
const fetch = (table, request, response) => {
  console.log('table', table);
  const keys = Object.keys(request.query);
  if (keys.length === 0) return null;
  const mode = 'OR';
  let data = null;

  const query = {
    mysql: `SELECT * FROM ${table}`,
    where: false,
    limit: false,
    order_by: false,
  };

  if (keys.length > 0) {
    for (const key of keys) {
      switch (key) {
        default:
          // １つのカラムに複数の値が存在する場合は IN を用いる
          // 例 ?name=neko -> [neko]
          // 例 ?name=neko,inu -> [neko, inu]
          data = request.query[key].split(',').map((data) => `'${data}'`);

          if (data.length === 1) {
            query.mysql = `${query.mysql} ${query.where ? mode : 'WHERE'} ${key} = ${data[0]}`;
          } else {
            query.mysql = `${query.mysql} ${query.where ? mode : 'WHERE'} ${key} in (${data.join(', ')})`;
          }

          query.where = true;
          break;

        case 'order':
          // 対象のカラム、ソート順、の順番で受け取る
          // 例 ?order=name,DESC
          data = request.query[key].split(',');
          query.mysql = `${query.mysql} ORDER BY ${data[0]} ${data[1]}`;
          break;

        case 'limit':
          query.mysql = `${query.mysql} LIMIT ${request.query[key]}`;
          break;
      }
    }
  }

  pool.getConnection((_, connection) => {
    connection.query(query.mysql, (error, result) => {
      if (error) {
        response.json({ result: [] });
        console.log(error);
        return;
      }

      response.json({ result: JSON.stringify(result) });
    });
  });
}

app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('/api/posts/', (request, response) => fetch('posts', request, response));
app.get('/api/commits/', (request, response) => fetch('commits', request, response));

app.get('*', (_, response) => {
  response.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

app.listen(port, () => console.log(`Listening on localhost:${port}`));
