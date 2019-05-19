import React, { Component } from "react";
import Auxiliary from "../../hoc/Auxiliary/Auxiliary";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import axios from "../../axios-orders";
import burger from "../../components/Burger/Burger";

const INGREDIENT_PRICES = {
  salad: 0.4,
  cheese: 0.5,
  meat: 1.5,
  bacon: 0.8
};

class BurgerBuilder extends Component {
  state = {
    ingredients: null,
    totalPrice: 4,
    purchasable: false,
    purchasing: false,
    loading: false,
    error: false
  };

  componentDidMount() {
    axios
      .get("https://react-my-burger-eb048.firebaseio.com/ingredients.json")
      .then(response => {
        this.setState({ ingredients: response.data });
      })
      .catch(error => this.setState({ error: true }));
  }

  updatePurchaseState(ingredients) {
    const sum = Object.keys(ingredients)
      .map(igKey => ingredients[igKey])
      .reduce((sum, val) => sum + val, 0);

    const updatedPurchasable = sum > 0;
    if (updatedPurchasable !== this.state.purchasable) {
      this.setState({ purchasable: updatedPurchasable });
    }
  }

  addIngredientHandler = type => {
    const oldIngredientCount = this.state.ingredients[type];

    const updatedIngredients = { ...this.state.ingredients };
    const priceToAdd = INGREDIENT_PRICES[type];

    const newIngredientCount = oldIngredientCount + 1;
    updatedIngredients[type] = newIngredientCount;

    const oldPrice = this.state.totalPrice;
    const updatedPrice = oldPrice + priceToAdd;

    this.setState({
      ingredients: updatedIngredients,
      totalPrice: updatedPrice
    });
    this.updatePurchaseState(updatedIngredients);
  };

  removeIngredientHandler = type => {
    const oldIngredientCount = this.state.ingredients[type];
    if (oldIngredientCount <= 0) {
      return;
    }

    const updatedIngredients = { ...this.state.ingredients };
    const priceToSubtract = INGREDIENT_PRICES[type];

    const newIngredientCount = oldIngredientCount - 1;
    updatedIngredients[type] = newIngredientCount;

    const oldPrice = this.state.totalPrice;
    const updatedPrice = oldPrice - priceToSubtract;

    this.setState({
      ingredients: updatedIngredients,
      totalPrice: updatedPrice
    });
    this.updatePurchaseState(updatedIngredients);
  };

  purchaseHandler = () => {
    this.setState({ purchasing: true });
  };

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false });
  };

  purchaseContinue = () => {
    // alert("You continue!");
    this.setState({ loading: true });
    let queryParams = [];
    for (let param in this.state.ingredients) {
      queryParams.push(
        encodeURI(param) + "=" + encodeURI(this.state.ingredients[param])
      );
    }
    queryParams.push("price=" + encodeURI(this.state.totalPrice));

    this.props.history.push({
      pathname: "/checkout",
      search: "?" + queryParams.join("&")
    });
  };

  render() {
    let disabledInfo = { ...this.state.ingredients };
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }

    let orderSummary = null;
    let burgerSection = <Spinner />;

    if (this.state.ingredients) {
      burgerSection = (
        <Auxiliary>
          <Burger ingredients={this.state.ingredients} />
          <BuildControls
            addIngredient={this.addIngredientHandler}
            removeIngredient={this.removeIngredientHandler}
            disabledInfo={disabledInfo}
            price={this.state.totalPrice}
            purchasable={this.state.purchasable}
            purchase={this.purchaseHandler}
          />
        </Auxiliary>
      );
      orderSummary = (
        <OrderSummary
          totalPrice={this.state.totalPrice}
          onCancel={this.purchaseCancelHandler}
          onContinue={this.purchaseContinue}
          ingredients={this.state.ingredients}
        />
      );
    }

    if (this.state.loading) {
      orderSummary = <Spinner />;
    }

    return (
      <Auxiliary>
        <Modal
          show={this.state.purchasing}
          onModalClose={this.purchaseCancelHandler}
        >
          {orderSummary}
        </Modal>
        {burgerSection}
      </Auxiliary>
    );
  }
}

export default withErrorHandler(BurgerBuilder, axios);
