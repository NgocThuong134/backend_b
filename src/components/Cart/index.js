import React, { useEffect } from 'react';
import CartItem from '../CartItem';
import Auth from '../../utils/auth';
import './style.css';
import { useStoreContext } from '../../utils/GlobalState';
import { TOGGLE_CART, ADD_MULTIPLE_TO_CART } from '../../utils/actions';
import { idbPromise } from "../../utils/helpers";
import { QUERY_CHECKOUT } from '../../utils/queries';
import { loadStripe } from '@stripe/stripe-js';
import { useLazyQuery } from '@apollo/react-hooks';

const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

const Cart = () => {
  const [state, dispatch] = useStoreContext();

  const [getCheckout, { data }] = useLazyQuery(QUERY_CHECKOUT);

  useEffect(() => {
    async function getCart() {
      const cart = await idbPromise('cart', 'get');
      
      const newProducts = cart.filter(product => 
        !state.cart.some(cartItem => cartItem._id === product._id)
      );
   
      if (newProducts.length) {
        dispatch({ type: ADD_MULTIPLE_TO_CART, products: newProducts });
      }
    };
  
    if (state.cart.length === 0) {
      getCart();
    }
  }, [state.cart.length, dispatch]);

  // stripe 
  useEffect(() => {
    if (data) {
      stripePromise.then((res) => {
        res.redirectToCheckout({ sessionId: data.checkout.session });
      });
    }
  }, [data]);

  function toggleCart() {
    dispatch({ type: TOGGLE_CART });
  }

  function calculateTotal() {
    let sum = 0;
    state.cart.forEach(item => {
      sum += item.price * item.purchaseQuantity;
    });
    return sum.toFixed(2);
  }

  function submitCheckout() {
    const productIds = [];
  
    state.cart.forEach((item) => {
      for (let i = 0; i < item.purchaseQuantity; i++) {
        productIds.push(item._id);
      }
    });

    getCheckout({
      variables: { products: productIds }
    });
  }

  // if cart is not open 
  if (!state.cartOpen) {
    return (
      <div className="cart-closed" onClick={toggleCart}>
        <span
          role="img"
          aria-label="trash">🛒</span>
      </div>
    );
  }


  return (
  <div className="cart">
    <div className="close" onClick={toggleCart}>[close]</div>
    <h2>Shopping Cart</h2>
    {state.cart.length ? (
        <div>
        {
        state.cart.map(item => (
            <CartItem key={item._id} item={item} />
        ))}
        <div className="flex-row space-between">
            <strong>Total: ${calculateTotal()}</strong>
            {
            Auth.loggedIn() ?
                <button onClick={submitCheckout}>
                Checkout
                </button>
                :
                <span>(log in to check out)</span>
            }
        </div>
        </div>
    ) : (
        <h3>
        <span role="img" aria-label="shocked">
            😱
        </span>
        You haven't added anything to your cart yet!
        </h3>
    )}
    </div>
  );
};

export default Cart;