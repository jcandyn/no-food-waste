// This script will run on the client side, handling clicks on ingredient buttons
// and fetching recipe information based on the clicked ingredient.

document.addEventListener('DOMContentLoaded', () => {
    const ingredientLinks = document.querySelectorAll('.ingredient-link');
    const recipesContainer = document.getElementById('recipes-container');

    ingredientLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const ingredient = e.target.getAttribute('data-ingredient');

            fetch(`/recipes/fetch-recipes?ingredient=${encodeURIComponent(ingredient)}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(recipes => {
                    displayRecipes(recipes);
                })
                .catch(error => {
                    console.error('Error fetching recipes:', error);
                    displayErrorMessage('Error fetching recipes. Please try again later.');
                });
        });
    });

    
    async function fetchRecipeDetails(recipeId) {
        console.log(`Fetching details for recipe ID: ${recipeId}`);
        try {
            const response = await fetch(`/recipes/recipe-info/${recipeId}`);
            const recipeDetails = await response.json();
            console.log('Received recipe details:', recipeDetails);
            displayRecipe(recipeDetails);
        } catch (error) {
            console.error('Error fetching recipe details:', error);
        }
    }
    
    function displayRecipes(recipes) {
        recipesContainer.innerHTML = ''; // Clear previous results

        if (!Array.isArray(recipes) || recipes.length === 0) {
            const message = document.createElement('p');
            message.className = 'no-recipes-message';
            message.textContent = 'No recipes found for this ingredient.';
            recipesContainer.appendChild(message);
        } else {
            recipes.forEach(recipe => {
                const recipeElement = document.createElement('div');
                recipeElement.className = 'recipe';
                recipeElement.innerHTML = `
                    <h3><a href="${recipe.spoonacularSourceUrl}" target="_blank">${recipe.title}</a></h3>
                    <a href="${recipe.spoonacularSourceUrl}" target="_blank">
                        <img src="${recipe.image}" alt="${recipe.title}">
                    </a>
                    <p>Servings: ${recipe.servings}</p>
                    <p>Ready in: ${recipe.readyInMinutes} minutes</p>
                    <p>Recipe from: <a href="${recipe.sourceUrl}" target="_blank">${recipe.sourceName}</a></p>
                `;
                recipesContainer.appendChild(recipeElement);
            });
        }
    
        
    }
    function displayErrorMessage(message) {
        recipesContainer.innerHTML = `<p class="error-message">${message}</p>`;
    }

    
});



