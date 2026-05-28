import { useState } from 'react';

type Recipe = {
  url: string;
  title: string;
  description: string;
  image?: string;
  prepTime: string;
  totalTime: string;
  servings: string;
  ingrediants: string[];
  instructions: string[];
  cuisine: string[];
  category: string[];
  tags: string[];
};

type RecipeCardProps = {
  recipe: Recipe;
};

function RecipeCard({ recipe }: RecipeCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className='recipe-card'>
      {/* Image */}
      {recipe.image && (
        <img
          className='recipe-card__image'
          src={recipe.image}
          alt={recipe.title}
        />
      )}

      {/* Content */}
      <div className='recipe-card__content'>
        <h2 className='recipe-card__title'>{recipe.title}</h2>

        {/* Meta */}
        <div className='recipe-card__meta'>
          <span>⏱ {recipe.totalTime}</span>
          <span>🍽 {recipe.servings}</span>
          <span>🔥 {recipe.prepTime}</span>
        </div>

        {/* Tags */}
        <div className='recipe-card__tags'>
          {recipe.tags?.slice(0, 3).map((tag) => (
            <span key={tag} className='recipe-card__tag'>
              {tag}
            </span>
          ))}
        </div>

        {/* Button */}
        <button
          className='recipe-card__button'
          onClick={() => setExpanded(!expanded)}>
          {expanded ? 'Hide Recipe' : 'View Recipe'}
        </button>

        {/* Expanded content (simple version) */}
        {expanded && (
          <div className='recipe-card__expanded'>
            <h4>Ingredients</h4>
            <ul>
              {recipe.ingredients.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>

            <h4>Instructions</h4>
            <ol>
              {recipe.instructions.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecipeCard;
