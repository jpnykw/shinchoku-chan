import { makeStyles } from '@material-ui/core/styles';

import Grid from '../components/Grid.js';
import Table from '../components/Table.js';
import TableBody from '../components/TableBody.js';
import TableCell from '../components/TableCell.js';
import TableContainer from '../components/TableContainer.js';
import TableHead from '../components/TableHead.js';
import TableRow from '../components/TableRow.js';

import { utc_to_jst } from '../utils/date.js';

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

