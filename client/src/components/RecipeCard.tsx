import { FiBookmark } from 'react-icons/fi';
import '../styles/recipe_card.css';
import type { Recipe } from '../types/recipe';
import { cleanDomain } from '../utils/cleanDomain';

type RecipeCardProps = {
  recipe: Recipe;
  onSave: () => void;
};

function RecipeCard({ recipe, onSave }: RecipeCardProps) {
  const displayTime = recipe.cookTime ?? recipe.prepTime;

  return (
    <div className='recipe-card'>
      {/* Image */}
      <div className='recipe-top'>
        {recipe.image && (
          <img
            className='recipe-card__image'
            src={recipe.image}
            alt={recipe.title}
          />
        )}
        <div className='recipe-header'>
          <h1 className='recipe-card__title'>{recipe.title}</h1>
          <p className='recipe-url'>
            from <a href={recipe.url}>{cleanDomain(recipe.url)}</a>
          </p>
          <div className='recipe-card__meta'>
            <div className='meta-item meta-item--servings'>
              <span className='meta-icon'>🍽</span>
              <span>{recipe.servings} servings</span>
            </div>

            {displayTime && (
              <div className='meta-item meta-item--time'>
                <span className='meta-icon'>⏱</span>
                <span>{displayTime}</span>
              </div>
            )}

            <div className='meta-item meta-item--save' onClick={onSave}>
              <FiBookmark className='meta-icon' />
              <span>Save</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='recipe-card__content'>
        <div className='recipe-ingredients'>
          <h2>Ingredients</h2>
          <ul>
            {recipe.ingredients.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
        <div className='recipe-instructions'>
          <h2>Directions</h2>
          {Array.isArray(recipe.instructions) &&
            (recipe.instructions[0]?.type === 'section' ? (
              recipe.instructions.map((section, i) => (
                <div key={i} className='instructions'>
                  {section.name && section.name !== 'Directions' && (
                    <h2>{section.name}</h2>
                  )}
                  <ol>
                    {section.steps.map((step, j) => (
                      <li key={j}>{step}</li> // steps restart at 1 per section automatically
                    ))}
                  </ol>
                </div>
              ))
            ) : (
              <ol>
                {recipe.instructions.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            ))}
        </div>
      </div>
    </div>
  );
}

export default RecipeCard;
