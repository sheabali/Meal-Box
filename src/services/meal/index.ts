/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

// get all products
export const getAllMeals = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/providers/my-menus`,
      {
        next: {
          tags: ['MEAL'],
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch orders: ${res.statusText}`);
    }

    const data = await res.json();
    console.log('data', data);
    return data;
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    throw new Error(error.message || 'Something went wrong');
  }
};
export const getAllMeal = async () => {
  try {
    const token = (await cookies()).get('accessToken')?.value;

    if (!token) {
      throw new Error('No access token found');
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/providers/my-menu`,
      {
        next: {
          tags: ['PRODUCT'],
        },
        headers: {
          Authorization: token,
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch orders: ${res.statusText}`);
    }

    const data = await res.json();
    console.log('data', data);
    return data;
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    throw new Error(error.message || 'Something went wrong');
  }
};

// get single product
export const getSingleMeal = async (mealId: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/providers/${mealId}`,
      {
        next: {
          tags: ['PRODUCT'],
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

// add product
export const addMeal = async (mealData: FormData): Promise<any> => {
  console.log('mealData', mealData);
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/providers/menu`,
      {
        method: 'POST',
        body: mealData,
        headers: {
          Authorization: (await cookies()).get('accessToken')!.value,
        },
      }
    );
    console.log('res', res);
    revalidateTag('MEAL');
    return res.json();
  } catch (error: any) {
    return Error(error);
  }
};

// update product
export const updateMeal = async (
  mealData: FormData,
  mealId: string
): Promise<any> => {
  console.log('mealData', mealData, mealId);
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/providers/${mealId}`,
      {
        method: 'PATCH',
        body: mealData,
        headers: {
          Authorization: (await cookies()).get('accessToken')!.value,
        },
      }
    );
    revalidateTag('PRODUCT');
    return res.json();
  } catch (error: any) {
    return Error(error);
  }
};

export const deleteMeal = async (mealId: string): Promise<any> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/providers/${mealId}`,
      {
        method: 'DELETE',
        headers: {
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
