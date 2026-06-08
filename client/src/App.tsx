import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Collection from './pages/Collection';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/Collection' element={<Collection />} />
    </Routes>
  );
}

export default App;
