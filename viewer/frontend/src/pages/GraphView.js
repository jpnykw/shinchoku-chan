import { makeStyles } from '@material-ui/core/styles';

import Grid from '../components/Grid.js';

import {
  utc_to_jst,
  parse_date
} from '../utils/date.js';

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

const progress_to_data = (progress) => {
  progress = JSON.parse(progress);

  // まずは同じ日付に投稿されたデータをまとめる
  // ついでに範囲内のユーザー全てをリストアップする
  const return_data = [];
  const new_data = {};
  const names = [];

  for (const data of progress) {
    const date = parse_date(utc_to_jst(data.date));
    const key = `${date[0][1]}/${date[0][2]}`;

    if (!names.includes(data.name)) {
      names.push(data.name);
    }

    if (new_data[key] === undefined) {
      new_data[key] = [data];
    } else {
      new_data[key].push(data);
    }
  }

  for (const [key, posts] of Object.entries(new_data)) {
    const new_data = { name: key };

    for (const name of names) {
      new_data[name] = 0;
    }

    for (const post of posts) {
      const key = post.name;
      new_data[key] += 1;
    }

    return_data.push(new_data);
  }

  return [return_data, names];
}

const GraphView = (props) => {
  const classes = useStyles();
  const progress = props.progress || '';

  const data = progress_to_data(progress)[0];
  const names = progress_to_data(progress)[1];

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
        {
          names.map((name, index) => {
            const color_palette = ['F3CA40', 'F2A541', 'F08A4B', 'D78A76', '577590'];
            const color = `#${color_palette[index]}`;
            return (
              index === 0 ? 
                (
                  <Line key={index} type="monotone" dataKey={name} stroke={color} activeDot={{ r: 8 }} />
                )
              :
                (
                  <Line key={index} type="monotone" dataKey={name} stroke={color} />
                )
            )
          })
        }
      </LineChart>
    </Grid>
  );
}

export default GraphView;
