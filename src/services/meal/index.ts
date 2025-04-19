/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

// get all products
export const getAllMeal = async () =>
  // page?: string,
  // limit?: string,
  // query?: { [key: string]: string | string[] | undefined }
  {
    // const params = new URLSearchParams();

    // if (query?.price) {
    //   params.append('minPrice', '0');
    //   params.append('maxPrice', query?.price.toString());
    // }

    // if (query?.category) {
    //   params.append('categories', query?.category.toString());
    // }
    // if (query?.brand) {
    //   params.append('brands', query?.brand.toString());
    // }
    // if (query?.rating) {
    //   params.append('ratings', query?.rating.toString());
    // }

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
export const updateProduct = async (
  productData: FormData,
  productId: string
): Promise<any> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/product/${productId}`,
      {
        method: 'PATCH',
        body: productData,
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
