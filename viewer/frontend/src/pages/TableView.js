import { makeStyles } from '@material-ui/core/styles';

import Grid from '../components/Grid.js';
import Table from '../components/Table.js';
import TableBody from '../components/TableBody.js';
import TableCell from '../components/TableCell.js';
import TableContainer from '../components/TableContainer.js';
import TableHead from '../components/TableHead.js';
import TableRow from '../components/TableRow.js';
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
  tableGrid: {
    marginTop: theme.spacing(2),
  },
}));

const TableView = (props) => {
  const classes = useStyles();
  const error = props.error;
  const progress = props.progress || '';

  return (
    <Grid container justify = 'center' className={classes.tableGrid}>
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
                <TableRow
                  style={
                    key % 2 === 0 ? 
                    { background : '#f7fafc' } :
                    { background : 'white' }
                  }
                  key={key}
                >
                  <TableCell>{ name }</TableCell>
                  <TableCell>{ utc_to_jst(date) }</TableCell>
                  <TableCell>{ content }</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
}

export default TableView;

