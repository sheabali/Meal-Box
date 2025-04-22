/* eslint-disable @typescript-eslint/no-explicit-any */
import { IProduct } from '@/types';
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface CartProduct extends IProduct {
  image: any;
  orderQuantity: number;
}

interface InitialState {
  product: CartProduct | null;
  city: string;
  shippingAddress: string;
}

const initialState: InitialState = {
  product: null,
  city: '',
  shippingAddress: '',
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addProduct: (state, action) => {
      if (state.product && state.product._id === action.payload._id) {
        // ✅ If same product, increase quantity
        state.product.orderQuantity += 1;
      } else {
        // ✅ If different or first product, replace it
        state.product = {
          ...action.payload,
          orderQuantity: 1,
        };
      }
    },

    clearCart: (state) => {
      state.product = null;
    },

    updateCity: (state, action) => {
      state.city = action.payload;
    },

    updateShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
    },
  },
});

// ✅ Selectors
export const currentProduct = (state: RootState) => state.cart.product;
export const citySelector = (state: RootState) => state.cart.city;
export const shippingAddressSelector = (state: RootState) =>
  state.cart.shippingAddress;

export const orderSelector = (state: RootState) => {
  if (!state.cart.product) return null;

  return {
    products: [
      {
        product: state.cart.product._id,
        quantity: state.cart.product.orderQuantity,
        color: 'White',
      },
    ],
    shippingAddress: `${state.cart.shippingAddress} - ${state.cart.city}`,
    paymentMethod: 'Online',
  };
};

export const subTotalSelector = (state: RootState) => {
  const product = state.cart.product;
  if (!product) return 0;
  return (product.offerPrice ?? product.price) * product.orderQuantity;
};

export const shippingCostSelector = (state: RootState) => {
  if (!state.cart.product) return 0;
  return state.cart.city === 'Dhaka' ? 60 : 120;
};

export const grandTotalSelector = (state: RootState) => {
  return subTotalSelector(state) + shippingCostSelector(state);
};

// ✅ Exports
export const { addProduct, clearCart, updateCity, updateShippingAddress } =
  cartSlice.actions;

export default cartSlice.reducer;
