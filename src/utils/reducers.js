import { useReducer } from 'react';

import {
  UPDATE_PRODUCTS,
  UPDATE_CATEGORIES,
  UPDATE_CURRENT_CATEGORY,
  ADD_TO_CART,
  ADD_MULTIPLE_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_CART_QUANTITY,
  CLEAR_CART,
  TOGGLE_CART
} from '../utils/actions';
  
  export const reducer = (state, action) => {
    switch (action.type) {
      // if action type value is the value of `UPDATE_PRODUCTS`, return a new state object with an updated products array
      case UPDATE_PRODUCTS:
        return {
          ...state,
          products: [...action.products],
        };

      // if action type value is the value of `UPDATE_CATEGORIES`, return a new state object with an updated categories array
      case UPDATE_CATEGORIES:
        return {
        ...state,
        categories: [...action.categories]
      };

      case UPDATE_CURRENT_CATEGORY:
        return {
        ...state,
        currentCategory: action.currentCategory
      };
      // add item to cart 
      case ADD_TO_CART:
      return {
        ...state,
        cartOpen: true,
        cart: [...state.cart, action.product]
      };
      // add more than 1 item to the cart 
      case ADD_MULTIPLE_TO_CART:
      // Tạo một bản sao cho giỏ hàng hiện tại
      const updatedCart = [...state.cart];

      // Lặp qua các sản phẩm mới để kiểm tra
      action.products.forEach(product => {
        const existingProduct = updatedCart.find(item => item._id === product._id);
        if (!existingProduct) {
          updatedCart.push({ ...product });
        }
      });

  return {
    ...state,
    cart: updatedCart,
  };
      // remove the product that has an action 
      case REMOVE_FROM_CART:
      let newState = state.cart.filter(product => {
        return product._id !== action._id;
      });

      return {
        ...state,
        cartOpen: newState.length > 0,
        cart: newState
      };
      // updating the product that has an action 
      case UPDATE_CART_QUANTITY:
      return {
        ...state,
        cartOpen: true,
        cart: state.cart.map(product => {
          if (action._id === product._id) {
            product.purchaseQuantity = action.purchaseQuantity;
          }
          return product;
        })
      };
      // clear all products in the cart
      case CLEAR_CART:
      return {
        ...state,
        cartOpen: false,
        cart: []
      };
      // opposite of state 
      case TOGGLE_CART:
      return {
        ...state,
        cartOpen: !state.cartOpen
      };

      // if it's none of these actions, do not update state at all and keep things the same!
      default:
        return state;
    }
  };

  export function useProductReducer(initialState) {
    return useReducer(reducer, initialState);
  }