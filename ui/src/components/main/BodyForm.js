import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

//redux
import { useSelector, useDispatch } from "react-redux";
import {
  updateFormData,
  updateCalorieData,
} from "../../redux/actions/formActions";
import { updateUserData } from "../../redux/actions/userActions"; // ьImport updateCalorieData
import { setCalculatedFlag } from "../../redux/actions/formActions";

import axios from "axios";
import { Calories } from "../../requests";

export default function BodyForm() {
  const user = useSelector((state) => state.user.user);

  // Проверка дали user е дефиниран
  const email = user?.email || "";
  const username = user?.username || "";
  const [calText, setCalText] = useState(false);
  const [calculatedCalories, setCalculatedCalories] = useState(0);

  const dispatch = useDispatch();
  const formDataFromStore = useSelector((state) => state.form.formData); // Извличане на данните от store

  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    weight: "",
    height: "",
    activitylevel: "",
  });

  const activitylevelMapping = {
    sedentary: "level_1",
    light: "level_2",
    moderate: "level_3",
    active: "level_4",
    extra: "level_5",
  };

  useEffect(() => {
    if (formDataFromStore) {
      setFormData(formDataFromStore);
    }
  }, [formDataFromStore]);

  function calculateCaloriesLocal(formData) {
    const { age, gender, weight, height, activitylevel } = formData;

    const isMale = gender === "male";
    const BMR = isMale
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

    let activityFactor = 1.2; // стойност по подразбиране
    switch (activitylevel) {
      case "level_1":
        activityFactor = 1.2;
        break;
      case "level_2":
        activityFactor = 1.375;
        break;
      case "level_3":
        activityFactor = 1.55;
        break;
      case "level_4":
        activityFactor = 1.725;
        break;
      case "level_5":
        activityFactor = 1.9;
        break;
      default:
        activityFactor = 1.2;
    }

    // Калкулатор за поддържане на тегло
    const maintainCalories = BMR * activityFactor;

    return maintainCalories;
  }

  // Във вашия код може да замените извикването на API с новата функция:
  const handleSubmit = (event) => {
    event.preventDefault(); // Спира презареждането на страницата

    // Проверка дали всички необходими полета са попълнени
    if (
      !formData.age ||
      !formData.gender ||
      !formData.weight ||
      !formData.height ||
      !formData.activitylevel
    ) {
      alert("Please fill in all the fields to calculate calories.");
      return;
    }

    // Изчисляване на калориите
    const result = calculateCaloriesLocal(formData);

    const newCaloriesData = {
      "maintain weight": { calory: result },
      "Mild weight gain": { calory: result + 200 },
      "Mild weight loss": { calory: result - 200 },
    };

    // Запазване на резултата в Redux Store
    dispatch(
      updateUserData({
        ...formData,
        calories: newCaloriesData,
      })
    );

    // Актуализиране на локалното състояние
    setCalculatedCalories(result); // Задава изчислените калории за показване
    dispatch(updateCalorieData(result));
    dispatch(setCalculatedFlag(true));
    setCalText(true); // Показва текста за калориите
  };

  // Reset the flag if any form data changes
  useEffect(() => {
    dispatch(setCalculatedFlag(false));
  }, [formData, dispatch]);

  // Dispatching form data
  const handleChange = (event) => {
    const { name, value } = event.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    dispatch(updateFormData(newFormData));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        Welcome {user?.username || ""}!
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            InputLabelProps={{
              shrink: true,
            }}
            id="age"
            name="age"
            label="Age"
            fullWidth
            variant="outlined"
            value={formData.age || ""}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required variant="outlined">
            <InputLabel id="gender-label">Gender</InputLabel>
            <Select
              labelId="gender-label"
              id="gender"
              name="gender"
              value={formData.gender || ""}
              onChange={handleChange}
              label="Gender"
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            InputLabelProps={{
              shrink: true,
            }}
            id="weight"
            name="weight"
            label="Weight (kg)"
            fullWidth
            variant="outlined"
            value={formData.weight || ""}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            InputLabelProps={{
              shrink: true,
            }}
            id="height"
            name="height"
            label="Height (cm)"
            fullWidth
            variant="outlined"
            value={formData.height || ""}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth required variant="outlined">
            <InputLabel id="activitylevel-label">Activity Level</InputLabel>
            <Select
              labelId="activitylevel-label"
              id="activitylevel"
              name="activitylevel"
              value={formData.activitylevel || ""}
              onChange={handleChange}
              label="Activity Level"
            >
              <MenuItem value="level_1">
                Sedentary (little or no exercise)
              </MenuItem>
              <MenuItem value="level_2">
                Lightly active (light exercise/sports 1-3 days/week)
              </MenuItem>
              <MenuItem value="level_3">
                Moderately active (moderate exercise/sports 3-5 days/week)
              </MenuItem>
              <MenuItem value="level_4">
                Very active (hard exercise/sports 6-7 days a week)
              </MenuItem>
              <MenuItem value="level_5">
                Extra active (very hard exercise/sports & physical job)
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
        Calculate Calories
      </Button>
      {calText && (
        <>
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Your optimal calories for maintaining weight based on your stats
            are: {calculatedCalories.toFixed(2)} cal.
          </Typography>
        </>
      )}
    </form>
  );
}
