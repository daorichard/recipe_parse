import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Saved from './pages/Saved';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/saved' element={<Saved />} />
    </Routes>
  );
}

export default App;
