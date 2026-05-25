const axios = require("axios");
const cheerio = require("cheerio");

// ─── Normalizers ─────────────────────────────────────────────────────────────

/**
 * Convert ISO 8601 duration (PT1H30M) → human-readable "1 hr 30 min"
 */
function parseDuration(iso) {
    if (!iso) return null;
    const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (!match) return iso;
    const [, h, m] = match;
    const parts = [];
    if (h) parts.push(`${h} hr`);
    if (m) parts.push(`${m} min`);
    return parts.join(" ") || null;
}

/**
 * Flatten Schema.org HowToStep arrays (can be nested objects or plain strings)
 */
function flattenInstructions(raw) {
    if (!raw) return [];
    const items = Array.isArray(raw) ? raw : [raw];
    return items.flatMap((item) => {
        if (typeof item === "string") return [item.trim()];
        if (item["@type"] === "HowToSection" && item.itemListElement)
            return flattenInstructions(item.itemListElement);
        return [item.text || item.name || ""].filter(Boolean);
    });
}

/**
 * Flatten ingredient list (can be strings or HowToIngredient objects)
 */
function flattenIngredients(raw) {
    if (!raw) return [];
    return (Array.isArray(raw) ? raw : [raw]).map((i) =>
        typeof i === "string" ? i.trim() : i.name || ""
    ).filter(Boolean);
}

// ─── Strategy 1: JSON-LD (Schema.org) ────────────────────────────────────────

function extractFromJsonLd($) {
    const scripts = $('script[type="application/ld+json"]');
    let recipe = null;

    scripts.each((_, el) => {
        if (recipe) return; // already found
        try {
            const json = JSON.parse($(el).html());
            // Handle @graph arrays (e.g. Yoast SEO)
            const nodes = json["@graph"] ? json["@graph"] : [json];
            const found = nodes.find(
                (n) => n["@type"] === "Recipe" || n["@type"]?.includes?.("Recipe")
            );
            if (found) recipe = found;
        } catch {
            // malformed JSON — skip
        }
    });

    if (!recipe) return null;

    return {
        title: recipe.name || null,
        description: recipe.description || null,
        image: Array.isArray(recipe.image)
            ? recipe.image[0]?.url || recipe.image[0]
            : recipe.image?.url || recipe.image || null,
        prepTime: parseDuration(recipe.prepTime),
        cookTime: parseDuration(recipe.cookTime),
        totalTime: parseDuration(recipe.totalTime),
        servings: recipe.recipeYield
            ? String(Array.isArray(recipe.recipeYield) ? recipe.recipeYield[0] : recipe.recipeYield)
            : null,
        ingredients: flattenIngredients(recipe.recipeIngredient),
        instructions: flattenInstructions(recipe.recipeInstructions),
        cuisine: recipe.recipeCuisine || null,
        category: recipe.recipeCategory || null,
        tags: recipe.keywords
            ? recipe.keywords.split(",").map((t) => t.trim())
            : [],
        source: "json-ld",
    };
}

// ─── Strategy 2: Cheerio HTML selectors (fallback) ───────────────────────────

function extractFromHtml($, url) {
    // Common CSS class patterns used by Tasty, AllRecipes, Food Network, etc.
    const title =
        $(".recipe-title, .wprm-recipe-name, .tasty-recipes-title, h1.recipe__title, h1")
            .first()
            .text()
            .trim() || null;

    const ingredients = [];
    $(
        ".wprm-recipe-ingredient, .tasty-recipes-ingredients li, .recipe-ingredients li, [class*='ingredient'] li"
    ).each((_, el) => {
        const text = $(el).text().trim();
        if (text) ingredients.push(text);
    });

    const instructions = [];
    $(
        ".wprm-recipe-instruction-text, .tasty-recipes-instructions li, .recipe-instructions li, [class*='instruction'] li, [class*='step'] li"
    ).each((_, el) => {
        const text = $(el).text().trim();
        if (text) instructions.push(text);
    });

    const servings =
        $(".wprm-recipe-servings, .tasty-recipes-yield, [class*='serving']")
            .first()
            .text()
            .trim() || null;

    if (!title && ingredients.length === 0) return null; // nothing found

    return {
        title,
        description: null,
        image: null,
        prepTime: null,
        cookTime: null,
        totalTime: null,
        servings,
        ingredients,
        instructions,
        cuisine: null,
        category: null,
        tags: [],
        source: "html-scrape",
    };
}

// ─── Main fetch + parse ───────────────────────────────────────────────────────

async function parseRecipeFromUrl(url) {
    const { data: html } = await axios.get(url, {
        headers: {
            // Mimic a real browser — some sites block default axios UA
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
            Accept: "text/html",
        },
        timeout: 10_000,
    });

    const $ = cheerio.load(html);

    const recipe =
        extractFromJsonLd($) ||   // fast + reliable
        extractFromHtml($, url);  // fallback scrape

    if (!recipe) throw new Error("No recipe data found on this page.");

    return { url, ...recipe };
}

module.exports = { parseRecipeFromUrl };