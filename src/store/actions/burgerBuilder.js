import * as actionTypes from "./actionTypes";
import axios from "../../axios-orders";

export const addIngredient = name => {
  return {
    type: actionTypes.ADD_INGREDIENT,
    ingredientName: name
  };
};
export const removeIngredient = name => {
  return {
    type: actionTypes.REMOVE_INGREDIENT,
    ingredientName: name
  };
};

export const setIngredients = ingredients => {
  return {
    type: actionTypes.SET_INGREDIENTS,
    ingredients: ingredients
  };
};

export const fetchingIngredientsFailed = () => {
  return {
    type: actionTypes.FETCHING_INGREDIENTS_FAILED
  };
};

export const fetchIngredients = () => {
  return dispatch => {
    axios
      .get("https://react-my-burger-eb048.firebaseio.com/ingredients.json")
      .then(response => {
        dispatch(setIngredients(response.data));
      })
      .catch(error => dispatch(fetchingIngredientsFailed()));
  };
};
