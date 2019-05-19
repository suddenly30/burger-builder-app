import React, { Component } from "react";
import Order from "../../components/Order/Order";
import axios from "../../axios-orders";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import Spinner from "../../components/UI/Spinner/Spinner";

class Orders extends Component {
  state = {
    orders: [],
    loading: true
  };

  componentDidMount() {
    axios
      .get("/orders.json")
      .then(res => {
        console.log(res);
        const orders = [];
        for (let key in res.data) {
          orders.push({ ...res.data[key], id: key });
        }
        this.setState({ loading: false, orders: orders });
      })
      .catch(error => {
        console.log(error);
        this.setState({ loading: false });
      });
  }

  render() {
    let orders = null;
    if (this.state.loading) {
      orders = <Spinner />;
    } else {
      orders = <p>You haven't ordered anything yet.</p>;
      if (this.state.orders.length > 0) {
        orders = this.state.orders.map(order => {
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

export default withErrorHandler(Orders, axios);
