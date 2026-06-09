import { useState, useEffect } from 'react';
import MiniRecipeCard from '@/components/MiniRecipeCard';
import Nav from '@/components/Nav';

export default function Collection() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const recipes = JSON.parse(localStorage.getItem('recipes') || '[]');
    setRecipes(recipes);
  }, []);

  return (
    <div className='container collection'>
      <Nav></Nav>
      <h1>Collection</h1>
      <div className='recipe-grid'>
        {recipes.length === 0 ? (
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
