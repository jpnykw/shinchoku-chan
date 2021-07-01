import {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import Container from '@material-ui/core/Container';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  title: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  tableGrid: {
    marginTop: theme.spacing(3),
  },
  properties: {
    width: 200,
  },
  formControl: {
    width: 152,
  },
  margin: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  }
}));

const Main = () => {
  const [progress, setProgress] = useState('');
  const [order, setOrder] = useState('');

  const handleChange = (event) => {
    setOrder(event.target.value);
    console.log('順序', event.target.value);
  };

  const fetch_posts_from_db = () => {
    let query = '';
    for (const column_name of ['name', 'limit']) {
      let prefix = query === '' ? '?' : '&';
      if (column_name === 'limit') {
        query = `${query}${prefix}order=date,${order}`;
        prefix = '&';
      }

      const column_value = document.querySelector(`#${column_name}`).value;
      if (column_value !== '') query = `${query}${prefix}${column_name}=${column_value}`;
    }

    console.log('query', query);

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
        <Typography variant="h5" className={classes.title}>💪進捗リスト💪</Typography>

        <Container className={`${classes.margin} ${classes.properties}`}>
          <TextField id="limit" label="表示件数" defaultValue={10} autoComplete="off" />
        </Container>

        <Container className={`${classes.margin} ${classes.properties}`}>
          <TextField id="name" label="ユーザー名" autoComplete="off" />
        </Container>

        <Container className={`${classes.margin} ${classes.properties}`}>
          <FormControl className={`${classes.margin} ${classes.formControl}`}>
            <InputLabel id="demo-simple-select-label">ソート順</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={order}
              defaultValue="ASC"
              onChange={handleChange}
            >
              <MenuItem value="ASC">昇順</MenuItem>
              <MenuItem value="DESC">降順</MenuItem>
            </Select>
          </FormControl>
        </Container>

        <Button
          variant="outlined"
          color="secondary"
          onClick={fetch_posts_from_db}
          className={classes.margin}
        >
          データを取得する
        </Button>
      </Container>

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
      </Grid>
    </>
  );
}

export default Main;
