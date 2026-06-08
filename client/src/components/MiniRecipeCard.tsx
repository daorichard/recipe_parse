import RecipeCard from './RecipeCard';
import type { Recipe } from '../types/recipe';
import '../styles/mini_recipe_card.css';
import { cleanDomain } from '../utils/cleanDomain';

type MiniRecipeProps = {
  recipe: Recipe;
  onDelete: () => void;
};

function MiniRecipeCard({ recipe, onDelete }: MiniRecipeProps) {
  const displayTime = recipe.cookTime ?? recipe.prepTime ?? recipe.totalTime;

  return (
    <div className='mini-card'>
      <img src={recipe.image} alt={recipe.title}></img>
      <div className='mini-card__body'>
        <h3>{recipe.title}</h3>
        <div className='mini-card__meta'>
          {displayTime && <span>⏱ {displayTime}</span>}
        </div>
      </div>
    </div>
  );
}

export default MiniRecipeCard;
