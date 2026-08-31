import { useState } from 'react';
import type { Recipe } from '../types/recipe';
import '../styles/mini_recipe_card.css';
import { Link } from 'react-router-dom';

type MiniRecipeProps = {
  recipe: Recipe;
  onDelete: () => void;
};

function MiniRecipeCard({ recipe, onDelete }: MiniRecipeProps) {
  const displayTime = recipe.cookTime ?? recipe.prepTime ?? recipe.totalTime;
  const [confirming, setConfirming] = useState(false);

  const handleDeleteClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setConfirming(true);
  };

  const handleCancel = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setConfirming(false);
  };

  const handleConfirm = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setConfirming(false);
    onDelete();
  };

  return (
    <Link to={`/recipe?url=${recipe.url}`}>
      <div className='mini-card'>
        <button
          type='button'
          className='mini-card__delete'
          aria-label='Delete recipe'
          onClick={handleDeleteClick}
        >
          &times;
        </button>
        <img src={recipe.image} alt={recipe.title}></img>
        <div className='mini-card__body'>
          <h3 className='mini-card__title'>{recipe.title}</h3>
          <div className='mini-card__meta'></div>
        </div>
        {confirming && (
          <div className='mini-card__confirm' onClick={(e) => e.stopPropagation()}>
            <p>Remove "{recipe.title}"?</p>
            <div className='mini-card__confirm-actions'>
              <button type='button' onClick={handleCancel}>
                Cancel
              </button>
              <button type='button' className='mini-card__confirm-delete' onClick={handleConfirm}>
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}

export default MiniRecipeCard;
