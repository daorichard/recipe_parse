import { useState } from 'react';
import './App.css';
import RecipeForm from '@/components/RecipeForm';
function App() {
  return (
    <>
      <div className='container'>
        <h1>Enter URL here</h1>
        <RecipeForm></RecipeForm>
      </div>
    </>
  );
}

export default App;
