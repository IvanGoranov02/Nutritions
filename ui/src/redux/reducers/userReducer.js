// reducers/userReducer.js
import {
  SET_USER,
  UPDATE_USER_DATA,
  SET_CALORIE_GOAL,
  SET_MEAL_DATA,
} from "../actions/userActions";

const initialState = {
  user: {},
  selectedCalorieGoal: null,
  mealData: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.payload,
      };
    case UPDATE_USER_DATA:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
      };
    case SET_CALORIE_GOAL:
      return {
        ...state,
        selectedCalorieGoal: action.payload,
      };
    case SET_MEAL_DATA:
      return {
        ...state,
        mealData: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
