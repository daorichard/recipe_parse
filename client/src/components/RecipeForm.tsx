import { useState } from 'react';
import RecipeCard from './RecipeCard';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/context/sessionContext';
import { saveRecipe } from '@/lib/recipes';
import type { Recipe } from '@/types/recipe';

export default function RecipeForm() {
  const [value, setValue] = useState('');
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const navigate = useNavigate();
  const { session } = useSession();

  const handleSave = async () => {
    if (!session) {
      navigate('/auth'); // not logged in → go to auth
      return;
    }
    if (!recipe) return;

    try {
      const saved = await saveRecipe(recipe, session.user.id);
      alert(saved ? 'Recipe saved!' : 'Recipe already saved.');
    } catch (error) {
      console.log(error);
      alert('Could not save recipe. Please try again.');
    }
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
