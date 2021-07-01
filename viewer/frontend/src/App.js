import './App.css';
import {useState, useEffect} from 'react';

const App = () => {
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
      <h1>進捗</h1>
      <button onClick={fetch_posts_from_db}>データを取得する</button>
      <div>
        {
          (progress === '' ? [] : JSON.parse(progress)).map((row_data_packet, key) => {
            const { name, content, date } = row_data_packet;
            return (
              <div key={key}>
                <span>{ name }</span>
                <span>at { date }</span>
                <span>: { content }</span>
              </div>
            )
          })
        }
      </div>
    </div>
  );
}

export default App;
