import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import hideLoadingScreenWhenReady from './loadingScreen';
import './App.css';
import Home from './pages/Home';

function App() {
  useEffect(() => {
    hideLoadingScreenWhenReady(document.getElementById('root'));
  }, []);

  return (
    <section className="App">
      <Routes>
        <Route path="/" element={ <Home /> } />
      </Routes>
    </section>
  );
}

export default App;
