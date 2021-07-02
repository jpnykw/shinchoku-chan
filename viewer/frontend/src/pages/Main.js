import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Button from '../components/Button.js';
import Container from '../components/Container.js';
import FormControl from '../components/FormControl.js';
import Grid from '../components/Grid.js';
import InputLabel from '../components/InputLabel.js';
import MenuItem from '../components/MenuItem.js';
import Select from '../components/Select.js';
import Table from '../components/Table.js';
import TableBody from '../components/TableBody.js';
import TableCell from '../components/TableCell.js';
import TableContainer from '../components/TableContainer.js';
import TableHead from '../components/TableHead.js';
import TableRow from '../components/TableRow.js';
import TextField from '../components/TextField.js';
import Typography from '../components/Typography.js';

const zero_pad = (...args) => {
  return args.map(number => {
    if (number.length > 1 && number[0] === '0') return number;
    return `${Number(number) < 10 ? '0' : ''}${number}`;
  });
}

const parse_date = (date_string) => {
  let date = date_string.split(' ')[0];
  let time = date_string.split(' ')[1];

  const [year, month, day] = date.split('/');
  date = zero_pad(year, month, day).join('/');
  const [hour, minute, second] = time.split(':');
  time = zero_pad(hour, minute, second).join(':');
  return `${date} ${time}`;
}

const zero_pad_date = (date_string = null) => {
  if (date_string === null) return null;
  return parse_date(date_string);
}

const utc_to_jst = (utc) => {
  const date = new Date(utc);
  date.setHours(date.getHours() + 9);
  const result = zero_pad_date(date.toLocaleString('ja'));
  return result === null ? 'タイムスタンプが不正な値です' : result;
}

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
  const [item, setItem] = useState(['古い順', '新しい順']);

  const handleOrderByChange = (event) => {
    setOrderBy(event.target.value);
    if (event.target.value === 'date') setItem(['古い順', '新しい順']);
    else setItem(['50音順 (A~Z)', '50音順 (Z~A)']);
  }

  const handleOrderChange = (event) => {
    setOrder(event.target.value);
  };

  const handleLimitChange = (event) => {
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
                <MenuItem value='ASC'>{item[0]}</MenuItem>
                <MenuItem value='DESC'>{item[1]}</MenuItem>
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
                {error ? '使えない値が入力されているよ' : progress === '' ? 'データを取得するボタンを押してね' : 'データが見つからないよ'}
              </Typography>
            )
          :
            (
              <TableContainer>
                <Table className={classes.table} aria-label='simple table'>
                  <TableHead>
                    <TableRow>
                      <TableCell>ユーザー</TableCell>
                      <TableCell>投稿日時(JST)</TableCell>
                      <TableCell>投稿内容</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {JSON.parse(progress).map((row_data_packet, key) => {
                      const { name, content, date } = row_data_packet;
                      return (
                        <TableRow key={key}>
                          <TableCell>{ name }</TableCell>
                          <TableCell>{ utc_to_jst(date) }</TableCell>
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
