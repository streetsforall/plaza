import React, {useState, useEffect } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState(null)
  const fetchData = async () => {
    try {
      const response = await fetch('/api')
      const res = await response.json();
      console.log(res)
      setData(res.express)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])



  return (
    <div className="App">
      <p>test</p>
      data: {data}
    </div>
  );

}


export default App;