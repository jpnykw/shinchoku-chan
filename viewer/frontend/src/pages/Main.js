import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '../components/Button.js';
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
    marginTop: theme.spacing(2),
  },
  properties: {
    width: '80%',
  },
  formControl: {
    width: '80%',
  },
  margin: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  }
}));

const Main = () => {
  const classes = useStyles();
  const [fetchDisabled, setFetchDisabled] = useState(false);
  const [progress, setProgress] = useState('');
  const [orderBy, setOrderBy] = useState('date');
  const [order, setOrder] = useState('DESC');
  const [error, setError] = useState(false);

  const handleOrderByChange = (event) => {
    setOrderBy(event.target.value);
  }

  const handleOrderChange = (event) => {
    setOrder(event.target.value);
  };

  const handleLimitChange = (event) => {
    console.log(event.target.value);
    if (event.target.value < 0) return setError(true);
    if (event.target.value === '') return setError(true);
    setError(false);
  }

  const fetch_posts_from_db = () => {
    if (error) return false;
    if (!fetchDisabled) setFetchDisabled(true);

    let query = '';
    for (const column_name of ['name', 'limit']) {
      let prefix = query === '' ? '?' : '&';
      if (column_name === 'limit') {
        query = `${query}${prefix}order=${orderBy},${order}`;
        prefix = '&';
      }

      const column_value = document.querySelector(`#${column_name}`).value;
      if (column_value !== '' && column_value !== '*') query = `${query}${prefix}${column_name}=${column_value}`;
    }

    fetch(`/api${query}`)
    .then((response) => response.json())
    .then((data) => {
      setProgress(data.result);
      // 連打してサーバーへの過度なアクセスを防ぐ為に 2.5 秒のクールダウンを発生させる
      setTimeout(() => setFetchDisabled(false), 2500);
    });
  }

  return (
    <>
      <Container>
        <Typography variant='h5' className={classes.title}>💪進捗リスト💪</Typography>

        <Grid container justify='center' className={classes.margin}>
          <Grid item xs={3}>
            <TextField
              id='limit'
              label='表示件数'
              type='number'
              placeholder='全件'
              defaultValue={100}
              autoComplete='off'
              className={classes.properties}
              onChange={handleLimitChange}
              error={error}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              id='name'
              label='ユーザー名'
              placeholder='全員'
              defaultValue='*'
              autoComplete='off'
              className={classes.properties}
            />
          </Grid>
        </Grid>

        <Grid container justify='center' className={classes.margin}>
          <Grid item xs={3}>
            <FormControl className={classes.formControl}>
              <InputLabel id='order-by-select'>ソートする値</InputLabel>
              <Select
                labelId='order-by-select'
                id='order-by-select'
                value={orderBy}
                defaultValue='date'
                onChange={handleOrderByChange}
              >
                <MenuItem value='date'>日付</MenuItem>
                <MenuItem value='name'>名前</MenuItem>
                <MenuItem value='content'>内容</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={3}>
            <FormControl className={classes.formControl}>
              <InputLabel id='order-select'>ソート順</InputLabel>
              <Select
                labelId='order-select'
                id='order-select'
                value={order}
                defaultValue='ASC'
                onChange={handleOrderChange}
              >
                <MenuItem value='ASC'>昇順</MenuItem>
                <MenuItem value='DESC'>降順</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Button
          variant='outlined'
          color='secondary'
          onClick={fetch_posts_from_db}
          className={classes.margin}
          disabled={fetchDisabled}
        >
          データを取得する
        </Button>
      </Container>

      <Grid container justify = 'center' className={classes.tableGrid}>
        {
          error || progress === '' || JSON.parse(progress).length === 0 ?
            (
              <Typography>
                {error ? '使えない値が入力されているよ' : progress === '' ? 'データを取得するボタンを押してね' : 'データが見つからないよ！'}
              </Typography>
            )
          :
            (
              <TableContainer>
                <Table className={classes.table} aria-label='simple table'>
                  <TableHead>
                    <TableRow>
                      <TableCell>ユーザー</TableCell>
                      <TableCell>投稿日時</TableCell>
                      <TableCell>投稿内容</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {JSON.parse(progress).map((row_data_packet, key) => {
                      const { name, content, date } = row_data_packet;
                      return (
                        <TableRow key={key}>
                          <TableCell>{ name }</TableCell>
                          <TableCell>{ date }</TableCell>
                          <TableCell>{ content }</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )
        }
      </Grid>
    </>
  );
}

export default Main;
