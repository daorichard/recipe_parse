import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/context/SessionContext';
import { useToast } from '@/context/toastContext';
import { saveRecipe } from '@/lib/recipes';
import type { Recipe } from '@/types/recipe';
import '../styles/add_recipe_fab.css';

type AddRecipeFabProps = {
  // Called with the newly saved recipe so the caller can update its list
  // without a refetch.
  onAdded: (recipe: Recipe) => void;
};

export default function AddRecipeFab({ onAdded }: AddRecipeFabProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [saving, setSaving] = useState(false);
  const { session } = useSession();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleOpen = () => {
    if (!session) {
      navigate('/auth'); // not logged in → go to auth, same as RecipeForm
      return;
    }
    setOpen(true);
  };

  const handleClose = () => {
    if (saving) return;
    setOpen(false);
    setValue('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!session) {
      navigate('/auth');
      return;
    }
    if (!value || value.indexOf('.com') === -1) {
      showToast('Please enter a valid link', 'error');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/parse?url=${encodeURIComponent(value)}`,
      );
      const data = await response.json();

      // error handler for when link is not a valid Recipe site — never let that reach saveRecipe/Supabase.
      if (!response.ok || !data || !data.title) {
        showToast(
          'No recipe could be found at that link. Please try a different URL.',
          'error',
        );
        return;
      }

      const recipe: Recipe = data;
      const saved = await saveRecipe(recipe, session.user.id);
      if (saved) {
        onAdded(recipe);
        showToast('Recipe saved!', 'success');
      } else {
        showToast('Recipe already saved.', 'error');
      }
      setOpen(false);
      setValue('');
    } catch (error) {
      console.log(error);
      showToast('Could not save recipe. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button type='button' className='add-recipe-fab' onClick={handleOpen}>
        <span className='add-recipe-fab__icon'>+</span>
        <span>Add Recipe</span>
      </button>

      {open && (
        <div className='add-recipe-overlay' onClick={handleClose}>
          <form
            className='add-recipe-panel'
            onClick={(event) => event.stopPropagation()}
            onSubmit={handleSubmit}>
            <h2>Add a recipe</h2>
            <div className='recipe-form'>
              <input
                className='recipe-input'
                type='text'
                autoFocus
                value={value}
                onChange={(event) => setValue(event.target.value)}
                placeholder='Paste a recipe URL'
              />
              <button className='recipe-button' type='submit' disabled={saving}>
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
            <button
              type='button'
              className='add-recipe-panel__cancel'
              onClick={handleClose}
              disabled={saving}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </>
  );
}
