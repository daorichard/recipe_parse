import { useState, useEffect } from 'react';
import MiniRecipeCard from '@/components/MiniRecipeCard';
import Nav from '@/components/Nav';
import { useSession } from '@/context/sessionContext';
import { fetchRecipes, deleteRecipe } from '@/lib/recipes';
import type { Recipe } from '@/types/recipe';

export default function Collection() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const { session } = useSession();

  useEffect(() => {
    if (!session) return;
    fetchRecipes(session.user.id)
      .then(setRecipes)
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, [session]);

  const handleDelete = (url: string) => {
    if (!session) return;
    // Optimistically remove it, then roll back if the delete fails.
    setRecipes((prev) => prev.filter((r) => r.url !== url));
    deleteRecipe(url, session.user.id).catch((error) => {
      console.log(error);
      fetchRecipes(session.user.id).then(setRecipes);
    });
  };

  return (
    <div className='container collection'>
      <Nav></Nav>
      <h1>Collection</h1>
      <div className='recipe-grid'>
        {loading ? (
          <p>Loading recipes…</p>
        ) : recipes.length === 0 ? (
          <p>No recipes yet.</p>
        ) : (
          // map over the array here and put it child components of savedRecipeCards
          recipes.map((recipe) => (
            <MiniRecipeCard
              key={recipe.url}
              recipe={recipe}
              onDelete={() => handleDelete(recipe.url)}
            />
          ))
        )}
      </div>
    </div>
  );
}
