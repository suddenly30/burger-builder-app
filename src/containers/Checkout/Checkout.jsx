import React, { Component } from "react";
import Spinner from "../../components/UI/Spinner/Spinner";
import CheckoutSummary from "../../components/CheckoutSummary/CheckoutSummary";
import { Route, Redirect } from "react-router-dom";
import ContactData from "./ContactData/ContactData";
import { connect } from "react-redux";

class Checkout extends Component {
  checkoutCancelHandler = () => {
    this.props.history.goBack();
  };

  checkoutConfirmHandler = () => {
    this.props.history.replace("/checkout/contact-data");
  };

  render() {
    let checkoutSummary = <Spinner />;
    if (this.props.ingredients) {
      const purchasedRedirect = this.props.purchased ? (
        <Redirect to="/" />
      ) : null;
      checkoutSummary = (
        <div>
          {purchasedRedirect}
          <CheckoutSummary
            ingredients={this.props.ingredients}
            onCheckoutCancel={this.checkoutCancelHandler}
            onCheckoutConfirmed={this.checkoutConfirmHandler}
          />
        </div>
      );
    }

    return (
      <div>
        {checkoutSummary}
        <Route
          path={this.props.match.path + "/contact-data"}
          component={ContactData}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    ingredients: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    purchased: state.orders.purchased
  };
};

export default connect(mapStateToProps)(Checkout);
