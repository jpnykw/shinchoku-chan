import {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
// import { Button, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  table: {
    minWidth: 650,
  },
  title: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  tableGrid: {
    marginTop: theme.spacing(4),
  },
}));

const Main = () => {
  const [progress, setProgress] = useState('');

  const fetch_posts_from_db = (query = '') => {
    fetch(`/api${query}`)
    .then((response) => response.json())
    .then((data) => setProgress(data.result));
  }

  useEffect(() => {
    if (progress === '') return false;
    console.log(JSON.parse(progress));
  });

  const classes = useStyles();

  return (
    <>
      <Container>
        <Typography variant="h4" className={classes.title}>💪進捗リスト💪</Typography>
        <Button variant="outlined" color="secondary" onClick={() => fetch_posts_from_db()}>データを取得する</Button>
      </Container>

      {/* <Container className={classes.tableContainer}> */}
      <Grid container justify = "center" className={classes.tableGrid}>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ユーザー</TableCell>
                <TableCell>投稿日時</TableCell>
                <TableCell>投稿内容</TableCell>
              </TableRow>
            </TableHead>

          <TableBody>
            {(progress === '' ? [] : JSON.parse(progress)).map((row_data_packet, key) => {
              const { name, content, date } = row_data_packet;
              return (
                <TableRow key={key}>
                  <TableCell>{ name }</TableCell>
                  <TableCell>{ date }</TableCell>
                  <TableCell>{ content }</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
          </Table>
        </TableContainer>
      {/* </Container> */}
      </Grid>
    </>
  );
}

export default Main;
