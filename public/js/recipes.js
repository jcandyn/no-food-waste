// This script will run on the client side, handling clicks on ingredient buttons
// and fetching recipe information based on the clicked ingredient.

document.addEventListener('DOMContentLoaded', () => {
    // Attach click event listeners to each ingredient button
    document.querySelectorAll('.ingredient').forEach(item => {
        item.addEventListener('click', function() {
            const ingredient = this.getAttribute('data-ingredient');

            // Fetch recipes from the server using the ingredient as a query parameter
            fetch(`/fetch-recipes?ingredient=${encodeURIComponent(ingredient)}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(recipes => {
                    // Process and display the recipes
                    // This could involve updating the DOM to show recipe details
                    displayRecipes(recipes);
                })
                .catch(error => {
                    console.error('Fetch error:', error);
                });
        });
    });
});

function displayRecipes(recipes) {
    // This function would update the DOM with the recipe details
    // For example, it might add the recipe details to a list or a table in the webpage
    const recipesContainer = document.getElementById('recipes-container'); // Assuming there's an HTML element with this ID

    // Clear any existing content
    recipesContainer.innerHTML = '';

    // Add new content
    recipes.forEach(recipe => {
        const recipeElement = document.createElement('div');
        recipeElement.className = 'recipe';
        recipeElement.innerHTML = `
            <h3>${recipe.title}</h3>
            <img src="${recipe.image}" alt="${recipe.title}">
            <p>Preparation time: ${recipe.readyInMinutes} minutes</p>
            <!-- More details can be added here -->
        `;
        recipesContainer.appendChild(recipeElement);
    });
}
