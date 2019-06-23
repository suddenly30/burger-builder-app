import React, { Component } from "react";
import Order from "../../components/Order/Order";
import axios from "../../axios-orders";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import Spinner from "../../components/UI/Spinner/Spinner";
import * as actions from "../../store/actions/index";
import { connect } from "react-redux";

class Orders extends Component {
  componentDidMount() {
    this.props.onFetchOrders();
  }

  render() {
    let orders = null;
    if (this.props.loading) {
      orders = <Spinner />;
    } else {
      orders = <p>You haven't ordered anything yet.</p>;
      if (this.props.orders.length > 0) {
        orders = this.props.orders.map(order => {
          return (
            <Order
              key={order.id}
              ingredients={order.ingredients}
              price={order.totalPrice}
            />
          );
        });
      }
    }

    return <div>{orders}</div>;
  }
}

const mapStateToProps = state => {
  return {
    orders: state.orders.orders,
    loading: state.orders.loading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchOrders: () => dispatch(actions.fetchOrders())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(Orders, axios));
