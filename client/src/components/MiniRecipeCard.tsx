import type { Recipe } from '../types/recipe';
import '../styles/mini_recipe_card.css';
import { Link } from 'react-router-dom';

type MiniRecipeProps = {
  recipe: Recipe;
  onDelete: () => void;
};

function MiniRecipeCard({ recipe, onDelete }: MiniRecipeProps) {
  const displayTime = recipe.cookTime ?? recipe.prepTime ?? recipe.totalTime;

  return (
    <Link to={`/recipe?url=${recipe.url}`}>
      <div className='mini-card'>
        <img src={recipe.image} alt={recipe.title}></img>
        <div className='mini-card__body'>
          <h3 className='mini-card__title'>{recipe.title}</h3>
          <div className='mini-card__meta'></div>
        </div>
      </div>
    </Link>
  );
}

export default MiniRecipeCard;
