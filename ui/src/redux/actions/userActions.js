// Типове на действия
export const SET_USER = "SET_USER";
export const UPDATE_USER_DATA = "UPDATE_USER_DATA";
export const SET_CALORIE_GOAL = "SET_CALORIE_GOAL";
export const SET_MEAL_DATA = "SET_MEAL_DATA";

// Действие за задаване на начален потребител
export const setUser = (user) => {
  return {
    type: SET_USER,
    payload: user,
  };
};

// Действие за актуализиране на потребителските данни
export const updateUserData = (userData) => {
  return {
    type: UPDATE_USER_DATA,
    payload: userData,
  };
};

export const setCalorieGoal = (calorieGoal) => {
  return {
    type: SET_CALORIE_GOAL,
    payload: calorieGoal,
  };
};
export const setMealData = (mealData) => ({
  type: SET_MEAL_DATA,
  payload: mealData,
});
