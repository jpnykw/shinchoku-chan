const password = process.env.PASSWORD;
const port = process.env.PORT || 8080;

const express = require('express');
const mysql = require('mysql');
const app = express();

const connection = mysql.createConnection({
  host: 'us-cdbr-east-04.cleardb.com',
  user: 'b529d6a4aa7138',
  database: 'heroku_29a6a27e7069b46',
  password,
});

app.get('/', (_, response) => {
  connection.query('SELECT * FROM posts', (_, result) => {
    response.send(`OK:<br>${result}`);
  });
});

app.listen(port, () => console.log(`Listening on localhost:${port}`));
