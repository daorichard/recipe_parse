import { useState } from 'react';

import RecipeCard from './RecipeCard';

export default function RecipeForm() {
  const [value, setValue] = useState('');
  const [recipe, setRecipe] = useState(null);

  const handleSave = () => {
    const existing = JSON.parse(localStorage.getItem('recipes') || '[]');

    // if it is already saved then return
    const alreadySaved = existing.some((r) => r.url === recipe.url);
    if (alreadySaved) return;

    localStorage.setItem('recipes', JSON.stringify([...existing, recipe]));
    alert('Recipe saved!');
  };

  const handleChange = (event) => {
    setValue(event.target.value);
    console.log(event.target.value);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!value || value.indexOf('.com') == -1) {
        alert('Please enter a valid link');
        return;
      }

      const response = await fetch(
        `http://localhost:4000/parse?url=${encodeURIComponent(value)}`,
      );
      const data = await response.json();
      setRecipe(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <form className='recipe-form'>
        <input
          className='recipe-input'
          type='text'
          value={value}
          onChange={handleChange}
          placeholder='Paste a recipe URL'
        />
        <button className='recipe-button' onClick={handleSubmit}>
          Get Recipe
        </button>
        {recipe && (
          <RecipeCard recipe={recipe} onSave={handleSave}></RecipeCard>
        )}
      </form>
    </>
  );
}
