import React from "react";

import Burger from "../Burger/Burger";
import Button from "../UI/Button/Button";
import classes from "./CheckoutSummary.css";

const checkoutSummary = props => {
  return (
    <div className={classes.CheckoutSummary}>
      <h2>We hope it tastes well!</h2>
      <div style={{ width: "100%", margin: "auto" }}>
        <Burger ingredients={props.ingredients} />
      </div>
      <Button type="Danger" clicked={props.onCheckoutCancel}>
        CANCEL
      </Button>
      <Button type="Success" clicked={props.onCheckoutConfirmed}>
        CONFIRM
      </Button>
    </div>
  );
};

export default checkoutSummary;
