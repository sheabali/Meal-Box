/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';
import { IAddress } from '@/types';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

export const getMyAddress = async () => {
  try {
    const token = (await cookies()).get('accessToken')?.value;

    if (!token) {
      console.warn('No access token found');
      return null;
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/address/get-my-address`,
      {
        next: {
          tags: ['ADDRESS'],
        },
        headers: {
          Authorization: token,
        },
      }
    );

    if (!res.ok) {
      if (res.status === 404) {
        console.warn('Address not found (404)');
        return null; // No address found, but not a fatal error
      }

      const errorText = await res.text();
      console.error('Fetch failed:', res.status, errorText);
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Unexpected error while fetching address:', error);
    return null; // Fallback to avoid crashing
  }
};

export const addAddress = async (addressData: IAddress) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/address`, {
      method: 'POST',

      body: JSON.stringify(addressData),

      headers: {
        Authorization: (await cookies()).get('accessToken')!.value,
        'Content-Type': 'application/json',
      },
    });

    // revalidateTag('address');
    return res.json();
  } catch (error: any) {
    return Error(error);
  }
};

export const updateAddress = async (addressData: FormData) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/address`, {
      method: 'PATCH',
      body: JSON.stringify(addressData),
      headers: {
        'Content-Type': 'application/json',
        Authorization: (await cookies()).get('accessToken')!.value,
      },
    });
    revalidateTag('address');
    return res.json();
  } catch (error: any) {
    return Error(error);
  }
};
