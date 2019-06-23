import React, { Component } from "react";
import classes from "./ContactData.css";
import Button from "../../../components/UI/Button/Button";
import Input from "../../../components/UI/Input/Input";
import axios from "../../../axios-orders";
import Spinner from "../../../components/UI/Spinner/Spinner";
import { connect } from "react-redux";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import * as actions from "../../../store/actions/index";

class ContactData extends Component {
  state = {
    orderForm: {
      name: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Name"
        },
        value: "",
        valid: false,
        validation: {
          required: true
        },
        touched: false
      },
      street: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Street"
        },
        value: "",
        valid: false,
        validation: {
          required: true
        },
        touched: false
      },
      country: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Country"
        },
        value: "",
        valid: false,
        validation: {
          required: true
        },
        touched: false
      },
      zipCode: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "ZIP"
        },
        value: "",
        valid: false,
        validation: {
          required: true,
          minLength: 5,
          maxLength: 5
        },
        touched: false
      },
      email: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "E-Mail"
        },
        value: "",
        valid: false,
        validation: {
          required: true
        },
        touched: false
      },
      deliveryMethod: {
        elementType: "select",
        elementConfig: {
          options: [
            { value: "fastest", displayText: "Fastest" },
            { value: "cheapest", displayText: "Cheapest" }
          ]
        },
        validation: {},
        value: "fastest",
        touched: false
      }
    },
    formIsValid: false
  };

  orderHandler = event => {
    event.preventDefault();

    const formData = {};
    for (let formElement in this.state.orderForm) {
      formData[formElement] = this.state.orderForm[formElement].value;
    }

    this.setState({ loading: true });
    const order = {
      ingredients: this.props.ingredients,
      totalPrice: this.props.price,
      orderData: formData
    };

    this.props.onPurchaseStart(order);
  };

  checkValidity(value, rules) {
    let isValid = true;

    if (rules.required) {
      isValid = value.trim() !== "" && isValid;
    }
    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }
    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid;
    }

    return isValid;
  }

  inputChangeHandler = (event, inputName) => {
    const updatedOrderForm = { ...this.state.orderForm };
    const updatedOrderFormElement = { ...updatedOrderForm[inputName] };
    updatedOrderFormElement.value = event.target.value;
    updatedOrderForm[inputName] = updatedOrderFormElement;
    updatedOrderFormElement.valid = this.checkValidity(
      updatedOrderFormElement.value,
      updatedOrderFormElement.validation
    );
    updatedOrderFormElement.touched = true;
    let formIsValid = true;
    for (let inputName in updatedOrderForm) {
      formIsValid = updatedOrderForm[inputName] && formIsValid;
    }
    this.setState({ orderForm: updatedOrderForm, formIsValid: formIsValid });
  };

  render() {
    let formElementsArray = [];

    for (let key in this.state.orderForm) {
      formElementsArray.push({
        id: key,
        config: this.state.orderForm[key]
      });
    }

    let form = (
      <form onSubmit={this.orderHandler}>
        {formElementsArray.map(element => (
          <Input
            key={element.id}
            elementType={element.config.elementType}
            elementConfig={element.config.elementConfig}
            value={element.config.value}
            invalid={!element.config.valid && element.config.touched}
            shouldValidate={element.config.validation}
            changed={event => this.inputChangeHandler(event, element.id)}
          />
        ))}
        <Button disabled={!this.state.formIsValid} type="Success">
          ORDER
        </Button>
      </form>
    );
    if (this.props.loading) {
      form = <Spinner />;
    }

    return (
      <div className={classes.ContactData}>
        <h4>Enter Your Contact Data</h4>
        {form}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    ingredients: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    loading: state.orders.loading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onPurchaseStart: orderData => dispatch(actions.purchaseBurger(orderData))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(ContactData, axios));
