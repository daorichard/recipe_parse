import RecipeCard from './RecipeCard';
import type { Recipe } from '../types/recipe';

type SavedRecipeProps = {
  recipe: Recipe;
  onDelete: () => void;
};

function SavedRecipeCard({ recipe, onDelete }: SavedRecipeProps) {
  return <div className='container'></div>;
}

export default SavedRecipeCard;
