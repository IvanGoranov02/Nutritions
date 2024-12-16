import React, { useState, useEffect } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import { useSelector, useDispatch } from "react-redux";

import axios from "axios";
import Meal from "./Meal";
export default function Review() {
  const selectedCalorieGoal = useSelector(
    (state) => state.user.selectedCalorieGoal?.calory
  );

  const [expanded, setExpanded] = useState(false);
  const [mealData, setMealData] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedCalorieGoal && !mealData) {
      fetchMealPlanWeek();
      console.log(selectedCalorieGoal);
    }
  }, [selectedCalorieGoal, mealData]);

  const fetchMealPlanWeek = async () => {
    if (isFetching) return;

    setIsFetching(true);
    try {
      const response = await axios.get(
        `https://api.spoonacular.com/mealplanner/generate?apiKey=d8e3ad4dee35418a928f00aae7ec7dce&timeFrame=week&targetCalories=${selectedCalorieGoal}`
      );
      setMealData(response.data);
      dispatch({ type: "SET_MEAL_DATA", payload: response.data });
    } catch (error) {
      console.error("Error fetching meal plan:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div>
      {mealData &&
        Object.entries(mealData.week).map(([dayName, dayData], index) => (
          <Accordion
            key={dayName}
            expanded={expanded === `panel${index}`}
            onChange={handleChange(`panel${index}`)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}bh-content`}
              id={`panel${index}bh-header`}
            >
              <Typography>
                {dayName.charAt(0).toUpperCase() + dayName.slice(1)}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div>
                <h1>Macros</h1>
                <ul>
                  <li>Calories: {dayData.nutrients.calories.toFixed(0)}</li>
                  <li>
                    Carbohydrates: {dayData.nutrients.carbohydrates.toFixed(0)}
                  </li>
                  <li>Fat: {dayData.nutrients.fat.toFixed(0)}</li>
                  <li>Protein: {dayData.nutrients.protein.toFixed(0)}</li>
                </ul>
              </div>
              {dayData.meals.map((meal) => (
                <Meal key={meal.id} meal={meal} />
              ))}
            </AccordionDetails>
          </Accordion>
        ))}
    </div>
  );
}
