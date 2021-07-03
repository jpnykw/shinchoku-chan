export const zero_pad = (...args) => {
  return args.map(number => {
    if (number.length > 1 && number[0] === '0') return number;
    return `${Number(number) < 10 ? '0' : ''}${number}`;
  });
}

export const parse_date = (date_string) => {
  let date = date_string.split(' ')[0];
  let time = date_string.split(' ')[1];

  const [year, month, day] = date.split('/');
  date = zero_pad(year, month, day); // .join('/');

  const [hour, minute, second] = time.split(':');
  time = zero_pad(hour, minute, second); // .join(':');

  // return `${date} ${time}`;
  return [date, time];
}

export const zero_pad_date = (date_string = null) => {
  if (date_string === null) return null;
  const parse = parse_date(date_string);
  const date = parse[0].join('/');
  const time = parse[1].join(':');
  return `${date} ${time}`;
}

export const utc_to_jst = (utc, raw = false) => {
  const date = new Date(utc);
  date.setHours(date.getHours() + 9);

  if (raw) {
    return date;
  } else {
    const result = zero_pad_date(date.toLocaleString('ja'));
    return result === null ? 'タイムスタンプが不正な値です' : result;
  }
}

