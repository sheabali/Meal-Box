/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { z } from 'zod';

import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import Loading from '@/components/shared/Loading';
import { addAddress, getMyAddress } from '@/services/address';
import { toast } from 'sonner';

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
  const [loading, setLoading] = useState(true);
  const [myAddress, setMyAddress] = useState<any>(null);
  console.log('myAddress', myAddress?.zipCode);

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

  // Fetch address and populate form
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const res = await getMyAddress();
        console.log('res', res?.data);

        if (res?.data) {
          setMyAddress(res.data);

          form.reset({
            customization: '',
            zipCode: res.data.zipCode || '',
            pickupStreet: res.data.pickupStreet || '',
            houseNo: res.data.houseNo || '',
            city: res.data.city || '',
          });
        }
      } catch (err) {
        console.error('Failed to fetch address in component:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, [form]);

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

    const res = await addAddress(payload);

    if (res?.success === false) {
      toast.error(res.message);
      return;
    }

    if (res?.success) {
      setCurrentStep((prev) => prev + 1);
      form.reset();
    }
  };

  if (loading) return <Loading label="Fetching your address..." />;

  return (
    <div className="px-5 flex flex-col justify-center max-w-xl w-full mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-xl md:text-3xl font-semibold text-primary">
          Pick up Address
        </h2>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="w-full space-y-2">
            <Label htmlFor="customization">Meal Customization</Label>
            <Input
              id="customization"
              placeholder="Optional"
              {...form.register('customization')}
            />
          </div>

          <div className="w-full space-y-2">
            <Label htmlFor="zipCode">Zip Code</Label>
            <Input
              placeholder="Zip Code"
              id="zipCode"
              {...form.register('zipCode')}
            />
          </div>

          <div className="w-full space-y-2">
            <Label htmlFor="pickupStreet">Pickup Street</Label>
            <Input
              placeholder="Pickup Street"
              id="pickupStreet"
              {...form.register('pickupStreet')}
            />
          </div>

          <div className="w-full space-y-2">
            <Label htmlFor="houseNo">House No</Label>
            <Input
              placeholder="House No"
              id="houseNo"
              {...form.register('houseNo')}
            />
          </div>

          <div className="w-full space-y-2">
            <Label htmlFor="city">City</Label>
            <Input placeholder="City" id="city" {...form.register('city')} />
          </div>

          <div className="w-full space-y-2">
            <Label>Select your receive date</Label>
            <Card className="p-2">
              <Calendar
                className="w-full"
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
