import { makeStyles } from '@material-ui/core/styles';

import Grid from '../components/Grid.js';
import Table from '../components/Table.js';
import TableBody from '../components/TableBody.js';
import TableCell from '../components/TableCell.js';
import TableContainer from '../components/TableContainer.js';
import TableHead from '../components/TableHead.js';
import TableRow from '../components/TableRow.js';
import Tag from '../components/Tag.js';

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

const TableView = ({
  darkMode,
  progress = '',
}) => {
  const classes = useStyles();
  if (progress === '') return null;

  return (
    <Grid container justify = 'center' className={classes.tableGrid}>
      <TableContainer>
        <Table className={classes.table} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>ユーザー</TableCell>
              <TableCell>タグ</TableCell>
              <TableCell>投稿日時(JST)</TableCell>
              <TableCell>投稿内容</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {JSON.parse(progress).map((row_data_packet, key) => {
              const { name, content, date, tag } = row_data_packet;
              const tag_key = ['progress', 'record', 'impression'][['進捗', '記録', '感想'].indexOf(tag === '' ? '進捗' : tag)];

              return (
                <TableRow
                  style={
                    key % 2 === 0 ? 
                      {
                        background : darkMode ? '#2a2a2a' : '#f7fafc'
                      }
                    :
                      {
                        background : 'none'
                      }
                  }
                  key={key}
                >
                  <TableCell>{ name }</TableCell>
                  <TableCell>
                    <Tag
                      size={'small'}
                      variant={'outlined'}
                      label={
                        {
                          'record': '記録',
                          'impression': '感想',
                          'progress': '進捗',
                        }[tag_key]
                      }
                      color={
                        {
                          'record': 'default',
                          'impression': 'primary',
                          'progress': 'secondary',
                        }[tag_key]
                      }
                    />
                  </TableCell>
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

