import { useState, useEffect } from 'react';
import MiniRecipeCard from '@/components/MiniRecipeCard';
import Nav from '@/components/Nav';
import { useSession } from '@/context/sessionContext';
import { fetchRecipes, deleteRecipe } from '@/lib/recipes';
import type { Recipe } from '@/types/recipe';

export default function Collection() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
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

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <div className='container collection'>
      <Nav></Nav>
      <h1>Collection</h1>
      {!loading && recipes.length > 0 && (
        <input
          type='search'
          className='collection-search'
          placeholder='Search your recipes…'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      )}
      <div className='recipe-grid'>
        {loading ? (
          <p>Loading recipes…</p>
        ) : recipes.length === 0 ? (
          <p>No recipes yet.</p>
        ) : filteredRecipes.length === 0 ? (
          <p>No recipes match "{query}".</p>
        ) : (
          // map over the array here and put it child components of savedRecipeCards
          filteredRecipes.map((recipe) => (
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
