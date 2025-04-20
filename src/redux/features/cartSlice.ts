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
    addProduct: (state, action) => {
      if (state.products.length === 0) {
        state.shopId = action.payload.shop._id;
      }
      const productToAdd = state.products.find(
        (product) => product._id === action.payload._id
      );

      if (productToAdd) {
        productToAdd.orderQuantity += 1;
        return;
      }

      state.products.push({ ...action.payload, orderQuantity: 1 });
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
