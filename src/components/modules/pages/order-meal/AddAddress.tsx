/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { z } from 'zod';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { addAddress, getMyAddress } from '@/services/address';
import { toast } from 'sonner';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
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
  const [loading, setLoading] = useState(true);
  const [myAddress, setMyAddress] = useState<any>(null);
  console.log(pickupDate);

  const form = useForm<FormDataType>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      customization: '',
      zipCode: '',
      pickupStreet: '',
      houseNo: '',
      city: '',
    },
  });

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const res = await getMyAddress();
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
        console.error('Failed to fetch address:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, [form]);

  const onSubmit = async (formData: FormDataType) => {
    console.log(pickupDate);
    if (!pickupDate) {
      setEmptyDateError('Please select pickup date');
      return;
    }

    console.log(formData.pickupStreet);
    console.log(dayjs(pickupDate).format('YYYY-MM-DD'));

    setEmptyDateError('');
    if (formData.customization) {
      localStorage.setItem('customization', formData.customization);
    }
    localStorage.setItem('pickupDate', dayjs(pickupDate).format('YYYY-MM-DD'));

    const payload = {
      ...formData,
    };
    delete payload.customization;

    const res = await addAddress(payload);
    console.log(res);

    if (res?.success === false) {
      toast.error(res.message);
      return;
    }

    if (res?.success) {
      setCurrentStep((prev) => prev + 1);
      form.reset();
      setPickupDate(undefined);
    }
  };

  if (loading) return <Loading label="Fetching your address..." />;

  return (
    <div className="px-4 py-10 md:py-16 max-w-3xl w-full mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-primary mb-2">
          Pick up Address
        </h2>
        <p className="text-gray-600 text-sm md:text-base">
          Please provide your address and preferred meal date.
        </p>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 bg-white shadow-xl rounded-2xl p-6 md:p-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="customization" className="text-gray-700">
              Meal Customization{' '}
              <span className="text-gray-400">(optional)</span>
            </Label>
            <Input
              id="customization"
              placeholder="Add any preferences"
              {...form.register('customization')}
              className="mt-2 py-6"
            />
          </div>

          <div>
            <Label htmlFor="zipCode" className="text-gray-700">
              Zip Code
            </Label>
            <Input
              placeholder="Zip Code"
              id="zipCode"
              {...form.register('zipCode')}
              className="mt-2 py-6"
            />
          </div>

          <div>
            <Label htmlFor="pickupStreet" className="text-gray-700">
              Pickup Street
            </Label>
            <Input
              placeholder="Pickup Street"
              id="pickupStreet"
              {...form.register('pickupStreet')}
              className="mt-2 py-6"
            />
          </div>

          <div>
            <Label htmlFor="houseNo" className="text-gray-700">
              House No
            </Label>
            <Input
              placeholder="House No"
              id="houseNo"
              {...form.register('houseNo')}
              className="mt-2 py-6"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="city" className="text-gray-700">
            City
          </Label>
          <Input
            placeholder="City"
            id="city"
            {...form.register('city')}
            className="mt-2 py-6"
          />
        </div>

        <div className="">
          <Label className="text-gray-700 mb-2 block">Pickup Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-[655px] py-6 justify-start text-left font-normal',
                  !pickupDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {pickupDate ? (
                  format(pickupDate, 'PPP')
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={pickupDate}
                onSelect={setPickupDate}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {emptyDateError && (
            <p className="text-sm text-red-500 mt-2">{emptyDateError}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full mt-6 text-white font-semibold text-base py-6"
        >
          {myAddress ? 'Update Address' : 'Save Address'}
        </Button>
      </form>
    </div>
  );
};

export default AddAddress;
