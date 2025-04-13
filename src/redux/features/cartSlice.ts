import { IProduct } from '@/types';
import { createSlice } from '@reduxjs/toolkit';

export interface CartProduct extends IProduct {
  orderQuantity: number;
}

interface InitialState {
  products: CartProduct[];
  // city: string;
  // shippingAddress: string;
}

const initialState: InitialState = {
  products: [],
  // city: '',
  // shippingAddress: '',
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingProduct = state.products.find(
        (item) => item._id === product._id
      );
      if (existingProduct) {
        existingProduct.orderQuantity += product.orderQuantity;
      } else {
        state.products.push(product);
      }
    },
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.products = state.products.filter((item) => item._id !== productId);
    },
    clearCart: (state) => {
      state.products = [];
    },
  },
});

export default cartSlice.reducer;
