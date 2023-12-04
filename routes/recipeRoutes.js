import express from 'express';
import { getUserInventory } from '../data/inventory.js'; // Adjust import based on your project structure

const router = express.Router();

router.get('/recipes', async (req, res) => {
    if (!req.user) {
        return res.redirect('/login');
    }

    try {
        const inventoryItems = await getUserInventory(req.user.id);
        let hasIngredients = inventoryItems && inventoryItems.length > 0;

        res.render('recipes', {
            layout: 'main',
            name: req.user.name,
            hasIngredients,
            inventoryItems  // Pass inventory items to the template
        });
    } catch (error) {
        console.error('Error in /recipes route:', error);
        res.status(500).send('Internal Server Error');
    }
});



export default router;


/*
// Additional route to handle fetching recipes by ingredient
router.get('/fetch-recipes', logoutMiddleware, async (req, res) => {
    try {
        const ingredient = req.query.ingredient;
        console.log('Fetching recipes for ingredient:', ingredient);
        const recipes = await findRecipesByIngredients([ingredient]);
        res.json(recipes);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ message: 'Error fetching recipes' });
    }
});
*/
