import { supabase } from '@/supabaseClient';
import type { Recipe } from '@/types/recipe';

// shape of the `recipes` table row (one column per Recipe field)
type RecipeRow = {
  id: string;
  user_id: string;
  url: string;
  title: string;
  description: string | null;
  image: string | null;
  prep_time: string | null;
  cook_time: string | null;
  total_time: string | null;
  servings: string | null;
  ingredients: string[];
  instructions: Recipe['instructions'];
  cuisine: string[];
  category: string[];
  tags: string[];
  created_at: string;
};

function toRow(recipe: Recipe, userId: string) {
  return {
    user_id: userId,
    url: recipe.url,
    title: recipe.title,
    description: recipe.description ?? null,
    image: recipe.image ?? null,
    prep_time: recipe.prepTime ?? null,
    cook_time: recipe.cookTime ?? null,
    total_time: recipe.totalTime ?? null,
    servings: recipe.servings ?? null,
    ingredients: recipe.ingredients ?? [],
    instructions: recipe.instructions ?? [],
    cuisine: recipe.cuisine ?? [],
    category: recipe.category ?? [],
    tags: recipe.tags ?? [],
  };
}

function fromRow(row: RecipeRow): Recipe {
  return {
    url: row.url,
    title: row.title,
    description: row.description ?? '',
    image: row.image ?? undefined,
    prepTime: row.prep_time ?? '',
    cookTime: row.cook_time ?? '',
    totalTime: row.total_time ?? '',
    servings: row.servings ?? '',
    ingredients: row.ingredients ?? [],
    instructions: row.instructions ?? [],
    cuisine: row.cuisine ?? [],
    category: row.category ?? [],
    tags: row.tags ?? [],
  };
}

// Save a parsed recipe for a user. Returns false (no-op) if that user already saved this url.
export async function saveRecipe(
  recipe: Recipe,
  userId: string,
): Promise<boolean> {
  const { data: existing, error: selectError } = await supabase
    .from('recipes')
    .select('id')
    .eq('user_id', userId)
    .eq('url', recipe.url)
    .maybeSingle();

  if (selectError) throw selectError;
  if (existing) return false; // already saved

  const { error: insertError } = await supabase
    .from('recipes')
    .insert(toRow(recipe, userId));

  if (insertError) throw insertError;
  return true;
}

// Fetch all recipes a user has saved, most recent first.
export async function fetchRecipes(userId: string): Promise<Recipe[]> {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(fromRow);
}