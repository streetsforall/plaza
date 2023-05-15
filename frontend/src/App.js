import { useState, useEffect } from 'react';

const App = () => {
  const [test, setTest] = useState('');

  useEffect(() => {
    getApi()
  }, []);

  const getApi = () => {
    // Get the passwords and store them in state
    fetch('/api/test')
      .then(res => res.json())
      .then(get => setTest(get));
  }

  return (
    <div className="App">
        <p>
          Okay lets begin
        </p>

          <h1>{test.test}</h1>
    </div>
  );
}

export default App;
