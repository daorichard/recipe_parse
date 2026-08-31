import { useState, useEffect } from 'react';
import MiniRecipeCard from '@/components/MiniRecipeCard';
import Nav from '@/components/Nav';
import { useSession } from '@/context/sessionContext';
import { fetchRecipes } from '@/lib/recipes';
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
          recipes.map((recipe, i) => (
            <MiniRecipeCard key={i} recipe={recipe} onDelete={() => {}} />
          ))
        )}
      </div>
    </div>
  );
}
