/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

export const createOrder = async (order: any) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/order`, {
      method: 'POST',
      headers: {
        Authorization: (await cookies()).get('accessToken')!.value,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    });

    return await res.json();
  } catch (error: any) {
    return Error(error);
  }
};

// get all products
export const getAllOrder = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/order/get-orders`,

      {
        next: {
          tags: ['ORDER'],
        },
        headers: {
          Authorization: (await cookies()).get('accessToken')!.value,
        },
      }
    );

    const data = await res.json();

    return data;
  } catch (error: any) {
    return Error(error.message);
  }
};
// get all products
export const getAddress = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/address/get-my-address`,

      {
        next: {
          tags: ['ORDER'],
        },
        headers: {
          Authorization: (await cookies()).get('accessToken')!.value,
        },
      }
    );

    const data = await res.json();

    return data;
  } catch (error: any) {
    return Error(error.message);
  }
};

// get single product
export const getSingleProduct = async (productId: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/product/${productId}`,
      {
        next: {
          tags: ['PRODUCT'],
        },
      }
    );
    const data = await res.json();
    return data;
  } catch (error: any) {
    return Error(error.message);
  }
};

// update product
export const updateOrderStatus = async (
  status: string,
  mealId: string
): Promise<any> => {
  console.log('status', status);
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/order/change-status/${mealId}`,
      {
        method: 'PATCH',
        body: JSON.stringify({ status }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: (await cookies()).get('accessToken')!.value,
        },
      }
    );

    revalidateTag('MEAL');
    return res.json();
  } catch (error: any) {
    return Error(error);
  }
};

export const deleteOrder = async (orderId: string): Promise<any> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/order/${orderId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: (await cookies()).get('accessToken')!.value,
        },
      }
    );

    revalidateTag('order');
    return res.json();
  } catch (error: any) {
    return Error(error);
  }
};
