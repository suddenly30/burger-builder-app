import React from "react";
import Auxiliary from "../../../hoc/Auxiliary";
import Button from "../../UI/Button/Button";

const orderSummary = props => {
  const ingredientSummary = Object.keys(props.ingredients).map(igKey => (
    <li key={igKey}>
      <span style={{ textTransform: "captialize" }}>{igKey}</span>:
      {props.ingredients[igKey]}
    </li>
  ));

  return (
    <Auxiliary>
      <h3>Your Order</h3>
      <p>A delicious burger with the following ingredients:</p>
      <ul>{ingredientSummary}</ul>
      <p>
        <strong>Total Price: {props.totalPrice.toFixed(2)}</strong>
      </p>
      <p>Continue to checkout?</p>
      <Button type="Danger" clicked={props.onCancel}>
        CANCEL
      </Button>
      <Button type="Success" clicked={props.onContinue}>
        CONTINUE
      </Button>
    </Auxiliary>
  );
};

export default orderSummary;
