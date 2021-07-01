import {useState, useEffect} from 'react';

const Main = () => {
  const [progress, setProgress] = useState('');

  const fetch_posts_from_db = () => {
    fetch('/api')
    .then((response) => response.json())
    .then((data) => setProgress(data.result));
  }

  useEffect(() => {
    if (progress === '') return false;
    console.log(JSON.parse(progress));
  })

  return (
    <div className="App">
      <h1>💪進捗リスト💪</h1>
      <button onClick={fetch_posts_from_db}>データを取得する</button>
      <table>
        <tbody>
          <tr>
            <th>ユーザー</th>
            <th>日時</th>
            <th>内容</th>
          </tr>
          {
            (progress === '' ? [] : JSON.parse(progress)).map((row_data_packet, key) => {
              const { name, content, date } = row_data_packet;
              return (
                <tr key={key}>
                  <td>{ name }</td>
                  <td>{ date }</td>
                  <td>{ content }</td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  );
}

export default Main;
