import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import * as colors from '@material-ui/core/colors';
import CssBaseline from '@material-ui/core/CssBaseline';

import Button from '../components/Button.js';
import Container from '../components/Container.js';
import FormControl from '../components/FormControl.js';
import FormControlLabel from '../components/FormControlLabel.js';
import Grid from '../components/Grid.js';
import InputLabel from '../components/InputLabel.js';
import MenuItem from '../components/MenuItem.js';
import Select from '../components/Select.js';
import Switch from '../components/Switch.js';
import TextField from '../components/TextField.js';
import Typography from '../components/Typography.js';

import TableView from './TableView.js';
import GraphView from './GraphView.js';

import DateFnsUtils from '@date-io/date-fns';

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(3),
  },
  title: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  margin: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  properties: {
    width: '80%',
  },
  pageBottom: {
    marginBottom: theme.spacing(10),
  }
}));

const Main = () => {
  const classes = useStyles();
  const most_new_data_date = new Date();
  const most_old_data_date = new Date('2021/6/30 00:00:00');

  const [selectedEndDate, setSelectedEndDate] = useState(most_new_data_date);
  const [selectedStartDate, setSelectedStartDate] = useState(most_old_data_date);

  const [fetchDisabled, setFetchDisabled] = useState(false);

  // フェッチ後すぐに再読み込みを行った場合はクールダウンを発生させる
  const timestamp = localStorage.getItem('fetch-timestamp');
  const cooldown = 3000;

  if (timestamp !== null && !fetchDisabled) {
    setFetchDisabled(true);
    const now = new Date().getTime();
    const delay = Math.max(0, cooldown - (now - timestamp));

    setTimeout(() => {
      localStorage.removeItem('fetch-timestamp');
      setFetchDisabled(false)
    }, delay);
  }

  const [progress, setProgress] = useState(''); // from posts table
  const [commits, setCommits] = useState(''); // from commits table

  const [orderBy, setOrderBy] = useState('date');
  const [order, setOrder] = useState('DESC');
  const [error, setError] = useState(false);
  const [item, setItem] = useState(['古い順', '新しい順']);

  const [diffState, setDiffState] = useState(false); // show graph of commits (diff)
  const [graphState, setGraphState] = useState(false); // show as graph

  // ダークテーマは実装中なので一部要素が正しく表示されない
  const [darkMode, setDarkMode] = useState(false);

  const theme = createMuiTheme({
    palette: {
      primary: {
        main: colors.blue[800],
      },
      type: darkMode ? 'dark' : 'light',
    },
  });

  const handleStartDateChange = (date) => {
    setSelectedStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setSelectedEndDate(date);
  };

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

  const handleGraphChange = (event) => {
    setGraphState(event.target.checked);
  }

  const handleDiffChange = (event) => {
    setDiffState(event.target.checked);
    // 差分表示が ON になった時にデータを取得していなかったら取得する
    // ただし progress が空 (posts からデータを取得していない場合) であれば
    // commits からの fetch を行わない
    if (!diffState && progress !== '' && commits === '') {
      fetch_table_from_db('commits');
    }
  }

  const fetch_table_from_db = (table = 'posts') => {
    if (error) return false;
    if (!fetchDisabled) setFetchDisabled(true);

    let query = '';
    const add_to_query = (query, param) => {
      let prefix = query === '' ? '?' : '&';
      return `${query}${prefix}${param}`
    }

    // ユーザー名
    const name = document.querySelector('#name').value;
    const use_name = name !== '' && name !== '*';
    if (table === 'posts' && use_name) query = add_to_query(query, `name=${name}`);
    if (table === 'commits' && use_name) query = add_to_query(query, `user=${name}`);

    // ソート順
    if (table === 'posts') query = add_to_query(query, `order=${orderBy},${order}`);
    if (table === 'commits' && orderBy === 'date') query = add_to_query(query, `order=${orderBy},${order}`);

    // 件数
    const limit = document.querySelector('#limit').value;
    if (limit !== '' && limit !== '*') query = add_to_query(query, `limit=${limit}`);

    fetch(`/api/${table}/${query}`)
    .then((response) => response.json())
    .then((data) => {
      const result = data.result;

      switch (table) {
        case 'posts':
          setProgress(result);
          break;

        case 'commits':
          setCommits(result);
          break;

        // no default
      }

      // サーバーへの過度なアクセスを防ぐ為にクールダウンを発生させる
      // またページをリロードした場合にも引き継ぎたいのでタイムスタンプを保持する
      localStorage.setItem('fetch-timestamp', new Date().getTime());
      setTimeout(() => {
        localStorage.removeItem('fetch-timestamp');
        setFetchDisabled(false);
      }, cooldown);
    });
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container className={classes.root}>
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
              onChange={(event) => handleLimitChange(event)}
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
            <FormControl className={classes.properties}>
              <InputLabel id='order-by-select'>ソートする値</InputLabel>
              <Select
                labelId='order-by-select'
                id='order-by-select'
                value={orderBy}
                defaultValue='date'
                onChange={(event) => handleOrderByChange(event)}
              >
                <MenuItem value='date'>日付</MenuItem>
                <MenuItem value='name'>名前</MenuItem>
                <MenuItem value='content'>内容</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={3}>
            <FormControl className={classes.properties}>
              <InputLabel id='order-select'>ソート順</InputLabel>
              <Select
                labelId='order-select'
                id='order-select'
                value={order}
                defaultValue='ASC'
                onChange={(event) => handleOrderChange(event)}
              >
                <MenuItem value='ASC'>{item[0]}</MenuItem>
                <MenuItem value='DESC'>{item[1]}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid container justify='center' className={classes.margin}>
            <Grid item xs={3}>
              <KeyboardDatePicker
                disableToolbar
                variant='inline'
                format='MM/dd/yyyy'
                margin='normal'
                label='開始日'
                value={selectedStartDate}
                onChange={(event) => handleStartDateChange(event)}
                className={classes.properties}
                minDate={most_old_data_date}
                disableFuture={true}
                style={
                  graphState ?
                  { display: 'inline-block' } :
                  { display: 'none' }
                }
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <KeyboardDatePicker
                disableToolbar
                variant='inline'
                format='MM/dd/yyyy'
                margin='normal'
                label='終了日'
                value={selectedEndDate}
                onChange={(event) => handleEndDateChange(event)}
                className={classes.properties}
                minDate={most_old_data_date}
                disableFuture={true}
                style={
                  graphState ?
                  { display: 'inline-block' } :
                  { display: 'none' }
                }
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </Grid>
          </Grid>
        </MuiPickersUtilsProvider>

        <Container
          style={
            graphState ?
            { display: 'inline-block' } :
            { display: 'none' }
          }
        >
          <FormControlLabel
            control={
              <Switch
                checked={diffState}
                onChange={(event) => handleDiffChange(event)}
                name='diff'
              />
            }
            label='差分を表示する'
          />
        </Container>

        <Container>
          <FormControlLabel
            control={
              <Switch 
                checked={graphState}
                onChange={(event) => handleGraphChange(event)}
                name='graph'
              />
            }
            label='グラフで表示する'
          />
        </Container>

        <Button
          variant='outlined'
          color='secondary'
          onClick={() => {
            fetch_table_from_db('posts');
            if (diffState) fetch_table_from_db('commits');
          }}
          className={classes.margin}
          disabled={fetchDisabled}
        >
          データを取得する
        </Button>
      </Container>

      <Container className={classes.pageBottom} >
        {
          error || progress === '' || JSON.parse(progress).length === 0 ?
            (
              <Typography className={classes.margin}>
                {
                  error ?
                    '使えない値が入力されているよ'
                  :
                  progress === '' ?
                    'データを取得するボタンを押してね'
                  :
                    'データが見つからないよ'
                }
              </Typography>
            )
          : (
            graphState ?
              (
                <GraphView
                  commits={commits}
                  progress={progress}
                  minDate={selectedStartDate}
                  maxDate={selectedEndDate}
                  showCommits={diffState}
                />
              )
            :
              (
                <TableView
                  progress={progress}
                />
              )
          )
        }
      </Container>
    </ThemeProvider>
  );
}

export default Main;

