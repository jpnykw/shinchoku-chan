const express = require('express');
const mysql = require('mysql');
const app = express();

app.get('/', (request, response) => {
  response.send('OK');
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on localhost:${port}`));