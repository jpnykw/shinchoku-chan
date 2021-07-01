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

// テーブルの値を取得するためのエンドポイント
app.get('/api', (request, response) => {
  const keys = Object.keys(request.query);
  const mode = 'OR';
  let data = null;

  const query = {
    mysql: 'SELECT * FROM posts',
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
          // 例 ?order=name,desc
          data = request.query[key].split(',');
          query.mysql = `${query.mysql} ORDER BY ${data[0]} ${data[1] === 'desc' ? 'DESC' : 'ASC'}`;
          break;
      }
    }
  }

  pool.getConnection((_, connection) => {
    connection.query(query.mysql, (error, result) => {
      if (error) {
        console.log(error);
        return;
      }

      response.json({ result: JSON.stringify(result) });
    });
  });
});

app.get('*', (_, response) => {
  response.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

app.listen(port, () => console.log(`Listening on localhost:${port}`));
