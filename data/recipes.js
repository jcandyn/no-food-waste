import axios from 'axios';

// Replace with your actual Spoonacular API key
const SPOONACULAR_API_KEY = 'd4ba958eb33242358a0aa3588e425c68';
const BASE_URL = 'https://api.spoonacular.com/recipes/findByIngredients';

export const findRecipesByIngredients = async (ingredients) => {
    try {
        const response = await axios.get(`${BASE_URL}`, {
            params: {
                ingredients: ingredients.join(','), // Joining ingredients array into a comma-separated string
                number: 10, // You can adjust the number of recipes to return
                apiKey: SPOONACULAR_API_KEY
            }
        });
        return response.data; // Returning the response data (recipes)
    } catch (error) {
        console.error('Error fetching recipes from Spoonacular:', error);
        throw error; // Propagating the error to be handled by the caller
    }
};
