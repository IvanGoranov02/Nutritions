import axios from "axios";

const fetchRecipes = async (minCalories, maxCalories) => {
  try {
    const response = await axios.get(
      "https://api.spoonacular.com/recipes/findByNutrients",
      {
        params: {
          minCalories: minCalories,
          maxCalories: maxCalories,
          number: 7,
          apiKey: "d8e3ad4dee35418a928f00aae7ec7dce",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching recipes:", error);
  }
};

export default fetchRecipes;
