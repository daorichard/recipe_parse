// test.js — run with: node test.js
const { parseRecipeFromUrl } = require("../services/recipeParser.js")
const fs = require("fs");

const TEST_URLS = [
    'https://www.eatyourselfskinny.com/asian-ground-turkey-and-green-bean-stir-fry/',
    'https://www.justonecookbook.com/tuna-mayo-onigiri/'
    // Add your own URLs here
];

async function runTests() {
    for (const url of TEST_URLS) {
        console.log(`\n${"=".repeat(60)}`);
        console.log(`Testing: ${url}`);
        console.log("=".repeat(60));

        try {
            const recipe = await parseRecipeFromUrl(url);

            // Pretty print to console
            console.log(`✅ Source:       ${recipe.source}`);
            console.log(`   Title:       ${recipe.title}`);
            console.log(`   Servings:    ${recipe.servings}`);
            console.log(`   Prep:        ${recipe.prepTime}`);
            console.log(`   Cook:        ${recipe.cookTime}`);
            console.log(`   Ingredients: ${recipe.ingredients.length} items`);
            recipe.ingredients.forEach((i) => console.log(`     - ${i}`));
            console.log(`   Steps:       ${recipe.instructions.length} steps`);
            recipe.instructions.forEach((s, i) =>
                console.log(`     ${i + 1}. ${s.slice(0, 80)}${s.length > 80 ? "…" : ""}`)
            );

            // Also save the full JSON result to a file
            const filename = `output_${Date.now()}.json`;
            fs.writeFileSync(filename, JSON.stringify(recipe, null, 2));
            console.log(`\n💾 Full result saved to: ${filename}`);
        } catch (err) {
            console.error(`❌ Failed: ${err.message}`);
        }
    }
}

runTests();