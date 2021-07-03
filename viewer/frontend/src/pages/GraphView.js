import { makeStyles } from '@material-ui/core/styles';

import Grid from '../components/Grid.js';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const useStyles = makeStyles((theme) => ({
  lineChart: {
    marginTop: theme.spacing(2),
    position: 'relative',
    right: '20px',
  }
}));

const Graph = () => {
  const classes = useStyles();

  // TODO: DBから取得したデータをもとに変換する
  const data = [
    {
      name: "07/03",
      jpnykw: 2,
      mirukuma: 5,
      luckYrat: 3,
    },
    {
      name: "07/02",
      jpnykw: 1,
      mirukuma: 3,
      luckYrat: 5,
    },
    {
      name: "07/01",
      jpnykw: 2,
      mirukuma: 2,
      luckYrat: 2,
    },
    {
      name: "06/30",
      jpnykw: 3,
      mirukuma: 1,
      luckYrat: 2,
    },
  ];

  return (
    <Grid container justify = 'center'>
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5
        }}
        className={classes.lineChart}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="jpnykw"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <Line type="monotone" dataKey="mirukuma" stroke="#82ca9d" />
        <Line type="monotone" dataKey="luckYrat" stroke="#cd8a9a" />

      </LineChart>
    </Grid>
  );
}

export default Graph;
