import { useEffect, useState } from 'react';
import RecipeCard from '@/components/RecipeCard';
import { useSearchParams } from 'react-router-dom';
import Nav from '@/components/Nav';
import { useSession } from '@/context/sessionContext';
import { fetchRecipeByUrl } from '@/lib/recipes';
import type { Recipe } from '@/types/recipe';

export default function RecipePage() {
  const [searchParams] = useSearchParams();
  const url = searchParams.get('url');
  // ProtectedRoute guarantees a session exists by the time this renders
  const { session } = useSession();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(() => !!url);

  useEffect(() => {
    if (!url) return;
    fetchRecipeByUrl(url, session!.user.id)
      .then(setRecipe)
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, [url, session]);

  if (loading) return <p>Loading recipe…</p>;
  if (!recipe) return <p>Recipe not found!!</p>;

  return (
    <div className='container'>
      <Nav></Nav>
      <RecipeCard recipe={recipe} onSave={() => {}} />
    </div>
  );
}
