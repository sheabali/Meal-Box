'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { z } from 'zod';
import {
  useCreateAddressMutation,
  useGetMyAddressQuery,
  useUpdateAddressMutation,
} from '@/redux/features/address/address.api';
import { handleAsyncWithToast } from '@/utils/handleAsyncWithToast';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import Loading from '@/components/shared/Loading';

const validationSchema = z.object({
  zipCode: z.string().min(1, 'Zip code is required'),
  pickupStreet: z.string().min(1, 'Pickup street is required'),
  houseNo: z.string().min(1, 'House number is required'),
  city: z.string().min(1, 'City is required'),
  customization: z.string().optional(),
});

type FormDataType = z.infer<typeof validationSchema>;

const AddAddress = ({
  setCurrentStep,
}: {
  setCurrentStep: Dispatch<SetStateAction<number>>;
}) => {
  const [pickupDate, setPickupDate] = useState<Date | undefined>(undefined);
  const [emptyDateError, setEmptyDateError] = useState('');

  const [createAddress] = useCreateAddressMutation();
  const [updateAddress] = useUpdateAddressMutation();
  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetMyAddressQuery(undefined);

  const myAddress = response?.data;

  const form = useForm<FormDataType>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      customization: '',
      zipCode: myAddress?.zipCode || '',
      pickupStreet: myAddress?.pickupStreet || '',
      houseNo: myAddress?.houseNo || '',
      city: myAddress?.city || '',
    },
  });

  useEffect(() => {
    if (pickupDate) {
      localStorage.setItem(
        'pickupDate',
        dayjs(pickupDate).format('YYYY-MM-DD')
      );
    }
  }, [pickupDate]);

  const onSubmit = async (formData: FormDataType) => {
    if (!pickupDate) {
      setEmptyDateError('Please select pickup date');
      return;
    }
    if (formData.customization) {
      localStorage.setItem('customization', formData.customization);
    }

    const payload = { ...formData };
    delete payload.customization;

    const apiCall = myAddress?._id ? updateAddress : createAddress;
    const toastMsg = myAddress?._id
      ? 'Updating Address...'
      : 'Adding Address...';

    const response = await handleAsyncWithToast(
      () => apiCall(payload),
      toastMsg
    );
    if (response?.data?.success) {
      setCurrentStep((prev) => prev + 1);
      form.reset();
    }
  };

  if (isLoading || isFetching) return <Loading />;

  return (
    <div className="px-5 flex flex-col justify-center max-w-xl w-full mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-xl md:text-3xl font-semibold text-primary">
          Pick up Address
        </h2>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="customization">Meal Customization</Label>
            <Input
              id="customization"
              placeholder="Optional"
              {...form.register('customization')}
            />
          </div>

          <div>
            <Label htmlFor="zipCode">Zip Code</Label>
            <Input id="zipCode" {...form.register('zipCode')} />
          </div>

          <div>
            <Label htmlFor="pickupStreet">Pickup Street</Label>
            <Input id="pickupStreet" {...form.register('pickupStreet')} />
          </div>

          <div>
            <Label htmlFor="houseNo">House No</Label>
            <Input id="houseNo" {...form.register('houseNo')} />
          </div>

          <div>
            <Label htmlFor="city">City</Label>
            <Input id="city" {...form.register('city')} />
          </div>

          <div className="space-y-2">
            <Label>Click to select your receive date</Label>
            <Card className="p-2">
              <Calendar
                mode="single"
                selected={pickupDate}
                onSelect={(date) => {
                  setPickupDate(date);
                  setEmptyDateError('');
                }}
                disabled={(date) => date < new Date()}
              />
            </Card>
            {emptyDateError && (
              <p className="text-red-500 text-sm">{emptyDateError}</p>
            )}
          </div>
        </div>

        <Button type="submit" className="w-full">
          {myAddress ? 'Update Address' : 'Save Address'}
        </Button>
      </form>
    </div>
  );
};

export default AddAddress;
