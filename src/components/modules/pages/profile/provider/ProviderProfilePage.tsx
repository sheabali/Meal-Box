/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { handleAsyncWithToast } from '@/utils/handleAsyncWithToast';
import Button from '@/components/shared/Button/Button';
import Loading from '@/components/shared/Loading/Loading';
import { useGetMeQuery } from '@/redux/features/auth/authApi';
import { useUpdateProviderProfileMutation } from '@/redux/features/profile/profile.provider';
import {
  useCreateAddressMutation,
  useGetMyAddressQuery,
  useUpdateAddressMutation,
} from '@/redux/features/address/address.api';
import MyFormWrapper from '@/components/ui/MyForm/MyFormWrapper/MyFormWrapper';
import MyFormInput from '@/components/ui/MyForm/MyFormInput/MyFormInput';
import { DollarSign, Package } from 'lucide-react';

const updateProviderProfileSchema = z.object({
  name: z.string().optional(),
  phoneNumber: z.string().optional(),
  dietaryPreferences: z.array(z.string()).optional(), // Optional array of strings
});

const addAddressValidationSchema = z.object({
  zipCode: z.string().min(1, 'Zip code is required'),
  pickupStreet: z.string().min(1, 'Pickup street is required'),
  houseNo: z.string().min(1, 'House number is required'),
  city: z.string().min(1, 'City is required'),
});

type UpdateProviderProfile = z.infer<typeof updateProviderProfileSchema>;

export default function ProviderProfilePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cuisinePreferences, setCuisinePreferences] = useState<string[]>([]);

  const [updateProviderProfile] = useUpdateProviderProfileMutation();

  const [createAddress] = useCreateAddressMutation();
  const [updateAddress] = useUpdateAddressMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateProviderProfile>({
    resolver: zodResolver(updateProviderProfileSchema),
  });

  const {
    data: me,
    isLoading: isMeLoading,
    isFetching: isMeFetching,
  } = useGetMeQuery(undefined);

  const {
    data: responseOfMyAddress,
    isLoading: isAddressLoading,
    isFetching: isAddressFetching,
  } = useGetMyAddressQuery(undefined);

  const provider = me?.data;
  const myAddress = responseOfMyAddress?.data;

  const cuisineSpecialties = [
    'Italian',
    'Mexican',
    'Indian',
    'Chinese',
    'Japanese',
    'Mediterranean',
  ];

  const handleCuisinePreferencesChange = (preference: string) => {
    const updatedCuisinePreferences = [...cuisinePreferences];
    const index = updatedCuisinePreferences.indexOf(preference);
    if (index === -1) {
      updatedCuisinePreferences.push(preference);
    } else {
      updatedCuisinePreferences.splice(index, 1);
    }
    setCuisinePreferences(updatedCuisinePreferences);
  };

  const onSubmit = async (data: UpdateProviderProfile) => {
    setIsSubmitting(true);
    const payload = {
      ...data,
      cuisineSpecialties: cuisinePreferences,
    };
    const res = await handleAsyncWithToast(async () => {
      return updateProviderProfile(payload);
    }, 'Updating...');
    if (res?.data?.success) {
      setIsSubmitting(false);
      reset();
    }
    setIsSubmitting(false);
  };

  const handleAddUpdateAddress = async (formData: any, reset: any) => {
    const payload = {
      ...formData,
    };

    if (!myAddress?._id) {
      const response = await handleAsyncWithToast(async () => {
        return createAddress(payload);
      }, 'Adding Address...');
      if (response?.data?.success) {
        reset();
      }
    } else {
      const response = await handleAsyncWithToast(async () => {
        return updateAddress(payload);
      }, 'Updating Address...');
      if (response?.data?.success) {
        reset();
      }
    }
  };

  if (isMeLoading || isMeFetching || isAddressLoading || isAddressFetching) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen w-[90%] mx-auto bg-gray-50 py-6 lg:py-10 sm:px-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
        <div className="col-span-1 md:col-span-3 row-span-5">
          <div className="w-full h-full mx-auto bg-gray-100 rounded-xl border border-gray-300 overflow-hidden">
            <div className="md:flex">
              <div className="p-8 w-full">
                <div className="uppercase tracking-wide text-sm text-primary font-semibold mb-1">
                  Provider Profile
                </div>
                <h1 className="block mt-1 text-lg leading-tight font-medium text-text-primary">
                  Update Your Details
                </h1>
                <p className="mt-2 text-gray-500">
                  Manage your personal information and preferences
                </p>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="mt-6 space-y-6"
                >
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Business Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      {...register('name')}
                      defaultValue={provider.name}
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email (read only)
                    </label>
                    <input
                      type="email"
                      id="email"
                      disabled
                      defaultValue={provider.email}
                      className="mt-1 block w-full px-3 py-2 disabled:cursor-not-allowed disabled:bg-gray-200 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phoneNumber"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Phone Number
                    </label>
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <span className="flex items-center text-base text-gray-500 bg-gray-200 rounded-lg border border-gray-300 px-3 py-2">
                        +88
                      </span>
                      <input
                        type="tel"
                        id="phoneNumber"
                        {...register('phoneNumber')}
                        defaultValue={provider.phoneNumber}
                        className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-700 mb-2">
                      Cuisine Specialties (current:{' '}
                      <span>
                        {Array.isArray(provider?.cuisineSpecialties) &&
                        provider.cuisineSpecialties.length > 0
                          ? provider.cuisineSpecialties.join(', ')
                          : 'N/A'}
                      </span>
                      )
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {cuisineSpecialties.map((option) => (
                        <div key={option} className="flex items-center">
                          <input
                            id={`diet-${option}`}
                            name="dietaryPreferences"
                            type="checkbox"
                            defaultChecked={
                              cuisinePreferences.includes(option) ||
                              provider?.cuisineSpecialties?.includes(option)
                            }
                            onChange={() =>
                              handleCuisinePreferencesChange(option)
                            }
                            className="h-4 w-4 accent-primary text-primary focus:ring-primary border-gray-300 rounded"
                          />
                          <label
                            htmlFor={`diet-${option}`}
                            className="ml-2 block text-sm text-gray-700"
                          >
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-end">
                    <Button
                      label={isSubmitting ? 'Saving...' : 'Save Changes'}
                      type="submit"
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 row-span-3 md:col-start-4 space-y-5">
          <div className="bg-gray-100 border border-gray-300 rounded-lg p-5">
            <div className="space-y-4">
              <h2 className="block text-lg text-text-primary">
                Shipping Address
              </h2>

              <MyFormWrapper
                onSubmit={handleAddUpdateAddress}
                resolver={zodResolver(addAddressValidationSchema)}
                className="space-y-4"
              >
                <div className="space-y-4">
                  <MyFormInput
                    value={myAddress?.zipCode}
                    name="zipCode"
                    placeHolder="Zip Code"
                  />
                  <MyFormInput
                    value={myAddress?.pickupStreet}
                    name="pickupStreet"
                    placeHolder="Pickup Street"
                  />
                  <MyFormInput
                    value={myAddress?.houseNo}
                    name="houseNo"
                    placeHolder="House No"
                  />
                  <MyFormInput
                    value={myAddress?.city}
                    name="city"
                    placeHolder="City"
                  />
                </div>
                <Button
                  label={myAddress ? 'Update Address' : 'Save Address'}
                  type="submit"
                  fullWidth
                />
              </MyFormWrapper>
            </div>
          </div>
          {/* <div className="bg-gray-100 border border-gray-300 rounded-lg p-6 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gray-200 rounded-full">
                <Package className="w-4 h-4 text-gray-500" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-normal text-text-primary">
                  Total Order
                </p>
                <h3 className="text-2xl font-semibold text-title tracking-tight">
                  345
                </h3>
              </div>
            </div>
          </div>
          <div className="bg-gray-100 border border-gray-300 rounded-lg p-6 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gray-200 rounded-full">
                <DollarSign className="w-4 h-4 text-gray-500" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-normal text-text-primary">
                  Money Spend
                </p>
                <h3 className="text-2xl font-semibold text-title tracking-tight">
                  $345
                </h3>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
