import { useState } from 'react';
import RecipeCard from './RecipeCard';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/context/SessionContext';
import { useToast } from '@/context/toastContext';
import { saveRecipe } from '@/lib/recipes';
import type { Recipe } from '@/types/recipe';

export default function RecipeForm() {
  const [value, setValue] = useState('');
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const navigate = useNavigate();
  const { session } = useSession();
  const { showToast } = useToast();

  const handleSave = async () => {
    if (!session) {
      navigate('/auth'); // not logged in → go to auth
      return;
    }
    if (!recipe || !recipe.title) return;

    try {
      const saved = await saveRecipe(recipe, session.user.id);
      showToast(
        saved ? 'Recipe saved!' : 'Recipe already saved.',
        saved ? 'success' : 'error',
      );
    } catch (error) {
      console.log(error);
      showToast('Could not save recipe. Please try again.', 'error');
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    console.log(event.target.value);
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      e.preventDefault();
      if (!value || value.indexOf('.com') == -1) {
        showToast('Please enter a valid link', 'error');
        return;
      }

      const response = await fetch(
        `http://localhost:4000/parse?url=${encodeURIComponent(value)}`,
      );
      const data = await response.json();

      // `{ err: '...' }`, not a Recipe — never let that reach the card/save flow.
      if (!response.ok || !data || !data.title) {
        setRecipe(null);
        showToast(
          'No recipe could be found at that link. Please try a different URL.',
          'error',
        );
        return;
      }

      setRecipe(data);
    } catch (error) {
      console.log(error);
      setRecipe(null);
      showToast('Could not reach the server. Please try again.', 'error');
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
