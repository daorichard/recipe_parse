import { useState, useEffect } from 'react';
import SavedRecipeCard from '@/components/SavedRecipeCard';
import RecipeCard from '@/components/RecipeCard';

export default function Collection() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const recipes = JSON.parse(localStorage.getItem('recipes') || '[]');
    setRecipes(recipes);
  }, []);

  return (
    <div>
      <h1>Collection</h1>
      <div>
        {recipes.length === 0 ? (
          <p>No recipes yet.</p>
        ) : (
          // map over the array here and put it child components of savedRecipeCards
          recipes.map((recipe, i) => (
            <RecipeCard key={i} recipe={recipe} onSave={() => {}} />
          ))
        )}
      </div>
    </div>
  );
}
