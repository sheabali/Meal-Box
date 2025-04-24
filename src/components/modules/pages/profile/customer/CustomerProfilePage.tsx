/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { handleAsyncWithToast } from '@/utils/handleAsyncWithToast';
// import { useUpdateCustomerProfileMutation } from '@/redux/features/profile/profile.customer.api';
import { DollarSign, Package } from 'lucide-react';

// import {
//   useCreateAddressMutation,
//   useGetMyAddressQuery,
//   useUpdateAddressMutation,
// } from '@/redux/features/address/address.api';
import MBFormInput from '@/components/ui/core/MBForm/MBFormInput/MBFormInput';
import { Button } from '@/components/ui/button';
import MBFormWrapper from '@/components/ui/core/MBForm/MBFormWrapper/MBFormWrapper';
import Loading from '@/components/shared/Loading';
import { useUser } from '@/context/UserContext';

interface IUser {
  dietaryPreferences?: string[];
}
import { addAddress, getMyAddress, updateAddress } from '@/services/address';
import {
  getCurrentUser,
  getSingleUser,
  updateCustomerProfile,
} from '@/services/AuthService';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const updateCustomerProfileSchema = z.object({
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

type UpdateCustomerProfile = z.infer<typeof updateCustomerProfileSchema>;

export default function CustomerProfilePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);
  const [responseOfMyAddress, setResponseOfMyAddress] = useState<any>(null);
  const [users, setUsers] = useState<any>(null);
  console.log('users', users);

  // const [isMeLoading, setIsMeLoading] = useState(false);
  // const [isMeFetching, setIsMeFetching] = useState(false);
  // const [isAddressLoading, setIsAddressLoading] = useState(false);
  // const [isAddressFetching, setIsAddressFetching] = useState(false);

  // const [updateCustomerProfile] = useUpdateCustomerProfileMutation();

  // const [createAddress] = useCreateAddressMutation();
  // const [updateAddress] = useUpdateAddressMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateCustomerProfile>({
    resolver: zodResolver(updateCustomerProfileSchema),
  });

  // const {
  //   data: me,
  //   isLoading: isMeLoading,
  //   isFetching: isMeFetching,
  // } = useGetMeQuery(undefined);

  const me = useUser();

  // const {
  //   data: responseOfMyAddress,
  //   isLoading: isAddressLoading,
  //   isFetching: isAddressFetching,
  // } = useGetMyAddressQuery(undefined);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!me?.user?.userId) return;

      try {
        const res = await getSingleUser(me.user.userId);

        if (res?.data) {
          setUsers(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchCurrentUser();
  }, [me?.user?.userId]);

  useEffect(() => {
    const fetchAddress = async () => {
      const res = await getMyAddress();
      if (res?.data) {
        setResponseOfMyAddress(res);
      }
    };

    fetchAddress();
  }, []);

  const customer = me?.user;

  const myAddress = responseOfMyAddress?.data;

  const dietaryOptions = [
    'Vegetarian',
    'Vegan',
    'Gluten-Free',
    'Dairy-Free',
    'Nut-Free',
    'Kosher',
    'Halal',
  ];

  const handleDietaryChange = (preference: string) => {
    const updatedDietaryPreferences = [...dietaryPreferences];
    const index = updatedDietaryPreferences.indexOf(preference);
    if (index === -1) {
      updatedDietaryPreferences.push(preference);
    } else {
      updatedDietaryPreferences.splice(index, 1);
    }
    setDietaryPreferences(updatedDietaryPreferences);
  };

  const onSubmit = async (data: UpdateCustomerProfile) => {
    setIsSubmitting(true);
    const payload = {
      ...data,
      dietaryPreferences,
    };

    //   const res = await handleAsyncWithToast(async () => {
    //     return updateCustomerProfile(payload);
    //   }, 'Updating...');
    //   if (res?.data.success) {
    //     setIsSubmitting(false);
    //     reset();
    //   }
    //   setIsSubmitting(false);
    // };

    try {
      const res = await updateCustomerProfile(payload);
      if (res?.data) {
        setIsSubmitting(false);
        reset();
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      setIsSubmitting(false);
      toast.error('Failed to update profile');
    }
  };

  const handleAddUpdateAddress = async (formData: any, reset: any) => {
    const payload = {
      ...formData,
    };
    console.log('payload', payload);

    if (!myAddress?._id) {
      const response = await addAddress(payload);
      if (response?.data?.success) {
        toast.success('Address added successfully');
        reset();
      }
    } else {
      const response = await updateAddress(payload);
      console.log('response', response);

      if (response?.data) {
        toast.success('Address updated successfully');
        reset();
      }
    }
  };

  // if (isMeLoading || isMeFetching || isAddressLoading || isAddressFetching) {
  //   return <Loading />;
  // }

  return (
    <div className="min-h-screen bg-muted px-4 sm:px-6 py-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Section */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border p-8">
          <h2 className="text-xl font-semibold text-primary mb-1">
            Customer Profile
          </h2>
          <p className="text-muted-foreground mb-6">
            Manage your personal information and preferences
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
            <div>
              <Label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </Label>
              <input
                type="text"
                id="name"
                required
                {...register('name')}
                defaultValue={users?.name}
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
                defaultValue={customer?.email}
                className="mt-1 block w-full px-3 py-2 disabled:cursor-not-allowed disabled:bg-gray-200 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <Label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </Label>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="flex items-center text-base text-gray-500 bg-gray-200 rounded-lg border border-gray-300 px-3 py-2">
                  +88
                </span>
                <input
                  type="tel"
                  id="phoneNumber"
                  {...register('phoneNumber')}
                  defaultValue={users?.phoneNumber}
                  className="block w-full px-3 py-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
            <div>
              <span className="block text-sm font-medium text-gray-700 mb-2">
                Dietary Preferences (current:{' '}
                <span>
                  {Array.isArray(customer?.dietaryPreferences) &&
                  customer.dietaryPreferences.length > 0
                    ? customer.dietaryPreferences.join(', ')
                    : 'N/A'}
                </span>
                )
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {dietaryOptions.map((option) => (
                  <div key={option} className="flex items-center">
                    <input
                      id={`diet-${option}`}
                      name="dietaryPreferences"
                      type="checkbox"
                      defaultChecked={
                        dietaryPreferences.includes(option) ||
                        customer?.dietaryPreferences?.includes(option)
                      }
                      onChange={() => handleDietaryChange(option)}
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
              <Button type="submit">
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>

        {/* Address Section */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-6">
          <h2 className="text-lg font-semibold text-primary">
            Shipping Address
          </h2>
          <MBFormWrapper
            onSubmit={handleAddUpdateAddress}
            resolver={zodResolver(addAddressValidationSchema)}
            className="space-y-4"
          >
            <MBFormInput
              value={myAddress?.zipCode}
              name="zipCode"
              placeHolder="Zip Code"
            />
            <MBFormInput
              value={myAddress?.pickupStreet}
              name="pickupStreet"
              placeHolder="Pickup Street"
            />
            <MBFormInput
              value={myAddress?.houseNo}
              name="houseNo"
              placeHolder="House No"
            />
            <MBFormInput
              value={myAddress?.city}
              name="city"
              placeHolder="City"
            />
            <Button type="submit" className="w-full">
              {myAddress ? 'Update Address' : 'Save Address'}
            </Button>
          </MBFormWrapper>
        </div>
      </div>
    </div>
  );
}
