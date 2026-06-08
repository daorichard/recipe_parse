import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Collection from './pages/Collection';
import Recipe from './pages/Recipe';
function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/Collection' element={<Collection />} />
      <Route path='/recipe' element={<Recipe />} />
    </Routes>
  );
}

export default App;
