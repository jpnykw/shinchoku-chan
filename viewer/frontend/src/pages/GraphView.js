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
  Legend,
  Label,
} from 'recharts';

const useStyles = makeStyles((theme) => ({
  lineChart: {
    marginTop: theme.spacing(2),
    position: 'relative',
    right: '20px',
  }
}));

const progress_to_data = (mode = 'posts', progress, minDate, maxDate) => {
  progress = JSON.parse(progress);

  // まずは同じ日付に投稿されたデータをまとめる
  // ついでに範囲内のユーザー全てをリストアップする
  const return_data = [];
  const new_data = {};
  const names = [];

  for (const data of progress) {
    const date = parse_date(utc_to_jst(data.date));
    const key = `${date[0][1]}/${date[0][2]}`;

    // データの日付が指定された範囲内であるかどうかを判定する
    const current_time = utc_to_jst(data.date, true).getTime();
    if(minDate.getTime() <= current_time && maxDate.getTime() >= current_time) {
      if (!names.includes(data.name)) {
        names.push(data.name);
      }

      if (new_data[key] === undefined) {
        new_data[key] = [data];
      } else {
        new_data[key].push(data);
      }
    }
  }

  for (const [key, posts] of Object.entries(new_data)) {
    const new_data = { name: key };

    for (const name of names) {
      new_data[name] = 0;
    }

    for (const post of posts) {
      const key = post.name;

      switch (mode) {
        case 'posts':
          new_data[key] += 1;
          break;

        case 'content-length':
          new_data[key] += post.content.length;
          break;

        default:
          break;
      }
    }

    return_data.push(new_data);
  }

  return [return_data.reverse(), names];
}

const GraphView = ({ progress = '', minDate, maxDate }) => {
  const color_palette = ['EA7317', '2364AA', 'F76F8E', '73BFB8'];
  const classes = useStyles();

  const results = [
    progress_to_data('posts', progress, minDate, maxDate),
    progress_to_data('content-length', progress, minDate, maxDate),
  ];

  const data = results.map((result) => result[0]);
  const names = results.map((result) => result[1]);

  return (
    <Grid container justify = 'center'>
      <LineChart
        width={500}
        height={300}
        data={data[0]}
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
        <YAxis/>
        <Tooltip />
        <Legend />
        {
          names[0].map((name, index) => {
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
      <LineChart
        width={500}
        height={300}
        data={data[1]}
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
          names[1].map((name, index) => {
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
