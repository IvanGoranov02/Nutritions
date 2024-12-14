import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useSelector, useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import { setCalorieGoal } from "../../redux/actions/userActions"; // Import the action

export default function MealForm() {
  const [selectedGoal, setSelectedGoal] = useState(null);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const calorieGoals = [
    "maintain weight",
    "Mild weight gain",
    "Mild weight loss",
  ];

  const handleSelectGoal = (goalType) => {
    setSelectedGoal(goalType);
    // Dispatch the action with the calorie goal type
    dispatch(setCalorieGoal({ goalType, calory: getCalorieData(goalType) }));
  };

  // Function to safely extract calorie data
  const getCalorieData = (goalType) => {
    const calorieData = user?.calories?.[goalType];
    return typeof calorieData === "object" ? calorieData?.calory : calorieData;
  };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Choose your calorie goal
      </Typography>
      <Grid container spacing={2}>
        {calorieGoals.map((goalType, index) => (
          <Grid item xs={12} key={goalType}>
            <Button
              variant={selectedGoal === goalType ? "contained" : "outlined"}
              color="primary"
              fullWidth
              onClick={() => handleSelectGoal(goalType)}
              style={{ padding: "20px", textTransform: "none" }}
            >
              <Typography variant="h6">
                {goalType.charAt(0).toUpperCase() + goalType.slice(1)}:{" "}
                {Math.round(getCalorieData(goalType))} cal
              </Typography>
            </Button>
          </Grid>
        ))}
      </Grid>
    </React.Fragment>
  );
}
