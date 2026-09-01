const axios = require("axios");
const cheerio = require("cheerio");

const BROWSER_USER_AGENT =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36";

// ─── Normalizers ─────────────────────────────────────────────────────────────
/* html returns messy text so this function will help convert entities into real characters
- for example: weird parens, and whitespace
*/
function cleanText(str) {
    if (!str) return str;
    return str
        .replace(/&#39;/g, "'")
        .replace(/&apos;/g, "'")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '')    // ← remove instead of replacing with "
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&nbsp;/g, " ")
        // Numeric character references, e.g. &#32; (decimal) and &#x20; (hex)
        .replace(/&#x([0-9a-fA-F]+);?/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
        .replace(/&#(\d+);?/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
        .replace(/\(\(([^)]*)\)\)/g, "($1)")
        .replace(/<[^>]*>/g, "")
        .trim();
}
/**
 * Convert ISO 8601 duration (PT1H30M) → human-readable "1 hr 30 min"
 */
function parseDuration(iso) {
    if (!iso) return null;
    // Some sites (e.g. Food Network) emit the full ISO 8601 form with a date
    // part before the time part, e.g. P0Y0M0DT0H5M0.000S — skip past the
    // date segment (Y/M/D) before matching the time segment (H/M/S).
    const match = iso.match(/T(?:(\d+)H)?(?:(\d+)M)?/);
    if (!match) return iso;
    const [, h, m] = match;
    const parts = [];
    if (h && Number(h) > 0) parts.push(`${h} hr`);
    if (m && Number(m) > 0) parts.push(`${m} minutes`);
    return parts.join(" ") || null;
}


/**
 * Flatten Schema.org HowToStep arrays (can be nested objects or plain strings)
 */
function flattenInstructions(raw) {
    if (!raw) return [];
    const items = Array.isArray(raw) ? raw : [raw];

    // Check if any item is a HowToSection
    const hasSections = items.some((item) => item["@type"] === "HowToSection");

    if (hasSections) {
        const result = [];
        let ungroupedSteps = [];

        for (const item of items) {
            if (item["@type"] === "HowToSection") {
                // If we have loose steps collected before this section, group them first
                if (ungroupedSteps.length > 0) {
                    result.push({ type: "section", name: "Directions", steps: ungroupedSteps });
                    ungroupedSteps = [];
                }
                result.push({
                    type: "section",
                    name: cleanText(item.name) || null,
                    steps: (item.itemListElement || [])
                        .map((step) => cleanText(typeof step === "string" ? step.trim() : step.text || step.name || ""))
                        .filter(Boolean),
                });
            } else {
                // Loose HowToStep — collect it instead of wrapping it solo
                const text = cleanText(typeof item === "string" ? item.trim() : item.text || item.name || "")
                if (text) ungroupedSteps.push(text);
            }
        }

        // Catch any remaining loose steps at the end
        if (ungroupedSteps.length > 0) {
            result.push({ type: "section", name: "Directions", steps: ungroupedSteps });
        }

        return result;
    }

    // No sections — return the original flat format so nothing else breaks
    return items.map((item) =>
        typeof item === "string" ? item.trim() : item.text || item.name || ""
    ).filter(Boolean);
}

/**
 * Flatten ingredient list (can be strings or HowToIngredient objects)
 */
function flattenIngredients(raw) {
    if (!raw) return [];
    return (Array.isArray(raw) ? raw : [raw]).map((i) =>
        cleanText(typeof i === "string" ? i.trim() : i.name || ""
        )).filter(Boolean);
}

// ─── Strategy 1: JSON-LD (Schema.org) ────────────────────────────────────────

function extractFromJsonLd($) {
    const scripts = $('script[type="application/ld+json"]');
    let recipe = null;

    scripts.each((_, el) => {
        if (recipe) return; // already found
        try {
            const json = JSON.parse($(el).html());
            // Handle @graph wrappers (e.g. Yoast SEO) and bare top-level
            // arrays (e.g. Food Network: [Recipe, BreadcrumbList])
            const nodes = json["@graph"] ? json["@graph"] : Array.isArray(json) ? json : [json];
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
        title: cleanText(recipe.name) || null,
        description: cleanText(recipe.description) || null,
        image: Array.isArray(recipe.image)
            ? recipe.image[0]?.url || recipe.image[0]
            : recipe.image?.url || recipe.image || null,
        prepTime: parseDuration(recipe.prepTime),
        cookTime: parseDuration(recipe.cookTime),
        totalTime: parseDuration(recipe.totalTime),
        servings: recipe.recipeYield
            ? cleanText(String(Array.isArray(recipe.recipeYield) ? recipe.recipeYield[0] : recipe.recipeYield))
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

    const image =
        $('meta[property="og:image"]').attr("content") ||
        $(
            ".wprm-recipe-image img, .tasty-recipes-image img, [class*='recipe'] img, article img"
        )
            .first()
            .attr("src") ||
        null;

    const ingredients = [];
    $(
        ".wprm-recipe-ingredient, .tasty-recipes-ingredients li, .recipe-ingredients li, [class*='ingredient'] li"
    ).each((_, el) => {
        const text = cleanText($(el).text().trim());
        if (text) ingredients.push(text);
    });

    const instructions = [];
    $(
        ".wprm-recipe-instruction-text, .tasty-recipes-instructions li, .recipe-instructions li, [class*='instruction'] li, [class*='step'] li"
    ).each((_, el) => {
        const text = cleanText($(el).text().trim());
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
        image: image,
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

/**
 * Plain HTTP fetch — fast, cheap, works for the vast majority of recipe sites.
 */
async function fetchHtmlWithAxios(url) {
    const { data: html } = await axios.get(url, {
        headers: {
            // Mimic a real browser — some sites block default axios UA
            "User-Agent": BROWSER_USER_AGENT,
            Accept: "text/html",
        },
        timeout: 10_000,
    });
    return html;
}

/**
 * Real-browser fetch via Playwright — slow and heavy, so this is only reached
 * when the plain HTTP request fails or comes back without a parsable recipe
 * (e.g. sites like Food Network sitting behind Akamai bot protection, which
 * blocks non-browser TLS fingerprints regardless of headers).
 */
async function fetchHtmlWithBrowser(url) {
    // Lazy-required: keeps Playwright's cost (Chromium download, memory) out
    // of the normal request path entirely unless this fallback actually runs.
    const { chromium } = require("playwright");

    const browser = await chromium.launch();
    try {
        const page = await browser.newPage({ userAgent: BROWSER_USER_AGENT });
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20_000 });
        return await page.content();
    } finally {
        await browser.close();
    }
}

function extractRecipe($, url) {
    return (
        extractFromJsonLd($) ||   // fast + reliable
        extractFromHtml($, url)   // fallback scrape
    );
}

async function parseRecipeFromUrl(url) {
    let recipe = null;

    try {
        const html = await fetchHtmlWithAxios(url);
        recipe = extractRecipe(cheerio.load(html), url);
    } catch {
        // Swallow — a failed plain fetch just means we fall through to the
        // browser-based attempt below.
    }

    if (!recipe) {
        const html = await fetchHtmlWithBrowser(url);
        recipe = extractRecipe(cheerio.load(html), url);
    }

    if (!recipe) throw new Error("No recipe data found on this page.");

    return { url, ...recipe };
}

module.exports = { parseRecipeFromUrl };