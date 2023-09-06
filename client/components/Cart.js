import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CartRow from "./utils/CartRow";
import { connect } from "react-redux";
import {
  fetchCart,
  fetch_GuestCart,
  fetch_GuestCartBuffer,
  addToUserCartFromGuest,
  remove_GuestCart,
} from "../store/cart";

function Cart({
  cart,
  isLoggedIn,
  loggedInUser,
  getCart,
  guestCart,
  getGuestCart,
  addToUserCart,
  removeGuestCart,
  getGuestCartBuffer,
  guestCartBuffer,
  state,
}) {
  console.log(loggedInUser, "what we need ");
  let rowView;

  useEffect(() => {
    try {
      getCart(loggedInUser);
      loggedInUser &&
        guestCartBuffer.map((item) =>
          addToUserCart(item.id, loggedInUser, item.price, item)
        );
    } catch (error) {
      console.log(error);
    }
  }, [loggedInUser, guestCart]);

  useEffect(() => {
    try {
      getGuestCart();
      getGuestCartBuffer();
      loggedInUser && removeGuestCart();
    } catch (error) {
      console.log(error);
    }
  }, [loggedInUser]);

  if (isLoggedIn) {
    cart && cart.length === 0
      ? (rowView = (
          <h1 style={{ textAlign: "center" }}>Cart is Empty!</h1>
        ))
      : (rowView =
          cart &&
          cart
            .sort((itemA, itemB) => itemA.id - itemB.id)
            .map((item) => (
              <CartRow
                key={item.id}
                id={item.id}
                name={item.name}
                price={item.price}
                imageUrl={item.imageUrl}
                quantity={item.quantity}
                loggedInUser={loggedInUser}
                guestUser={false}
              />
            )));
  } else {
    rowView =
      guestCart.length === 0 ? (
        <h1 style={{ textAlign: "center" }}>Cart is Empty!</h1>
      ) : (
        guestCart.map((item) => (
          <CartRow
            key={item.id}
            id={item.id}
            name={item.name}
            price={item.price}
            imageUrl={item.imageUrl}
            quantity={item.quantity}
            loggedInUser={loggedInUser}
            guestUser={true}
          />
        ))
      );
  }

  return (
    <div>
      {console.log(cart, "we on view")}
      <table style={{ width: "1200px", marginLeft: "60px" }}>
        <thead>
          <tr>
            <th className="product-thumbnail">Product</th>
            <th className="product-price">Price</th>
            <th className="product-quantity">Quantity</th>
            <th className="product-subtotal">Total</th>
            <th className="product-remove">Remove</th>
          </tr>
        </thead>

        <tbody>{rowView}</tbody>
        <Link to="/checkout">
          <button>Checkout</button>
        </Link>
      </table>
    </div>
  );
}

const mapState = (state) => ({
  cart: state.cart.userCart,
  guestCart: state.cart.guestCart,
  guestCartBuffer: state.cart.guestCartBuffer,
  isLoggedIn: !!state.auth.id,
  loggedInUser: state.auth.id,
  state: state,
});

const mapDispatch = (dispatch) => ({
  getCart: (loggedInUser) => dispatch(fetchCart(loggedInUser)),
  getGuestCart: () => dispatch(fetch_GuestCart()),
  getGuestCartBuffer: () => dispatch(fetch_GuestCartBuffer()),
  addToUserCart: (id, loggedInUser, price, productObj) =>
    dispatch(addToUserCartFromGuest(id, loggedInUser, price, productObj)),
  removeGuestCart: () => dispatch(remove_GuestCart()),
});

export default connect(mapState, mapDispatch)(Cart);
