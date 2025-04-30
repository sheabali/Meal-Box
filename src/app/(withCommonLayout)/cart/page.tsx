/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import amex from '../../../assets/payment/amex.png';
import mar from '../../../assets/payment/mar.png';
import paypal from '../../../assets/payment//paypal.png';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Check } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import StripeCardForm from '@/components/modules/pages/order-meal/StripeCardForm';
import AddAddress from '@/components/modules/pages/order-meal/AddAddress';
import { MapPin, ArrowRight, ArrowLeft } from 'lucide-react';
import { createOrder, getAddress } from '@/services/order';

import { clearCart, currentProduct } from '@/redux/features/cartSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { handleAsyncWithToast } from '@/utils/handleAsyncWithToast';
import { useUser } from '@/context/UserContext';
import Image from 'next/image';
import { Input } from '@/components/ui/input';

const steps = [
  'Shipping Address',
  'Order Summary',
  'Payment Method',
  'Confirm Payment',
  'Completed Payment',
];

const Stepper = ({ currentStep }: { currentStep: number }) => (
  <div className="flex justify-between items-center w-full max-w-3xl mx-auto mb-8">
    {steps.map((step, index) => (
      <div key={index} className="flex-1 text-center relative">
        <div
          className={cn(
            'w-8 h-8 rounded-full mx-auto flex items-center justify-center font-medium text-sm z-10',
            index < currentStep
              ? 'bg-green-500 text-white'
              : index === currentStep
              ? 'bg-primary text-white'
              : 'bg-muted text-muted-foreground'
          )}
        >
          {index < currentStep ? <Check size={16} /> : index + 1}
        </div>
        <p className="text-xs md:text-sm mt-2">{step}</p>
        {index < steps.length - 1 && (
          <div className="absolute top-4 left-1/2 w-full h-0.5 bg-muted z-0" />
        )}
      </div>
    ))}
  </div>
);

const OrderMealPage = () => {
  const currentMeal = useAppSelector(currentProduct);

  const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  if (!stripeKey) {
    console.error(
      'Stripe publishable key is missing. Check your environment variables.'
    );
  }

  const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

  const [myAddress, setMyAddress] = useState<any>(null);

  const dispatch = useAppDispatch();

  const me = useUser();

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const address = await getAddress();
        setMyAddress(address);
      } catch (error) {
        console.error('Failed to fetch address:', error);
      }
    };

    fetchAddress();
  }, []);
  const [currentStep, setCurrentStep] = useState<number>(0); // Ensure currentStep is explicitly typed as a number

  // const [pickupDate, setPickupDate] = useState('');
  const [customization, setCustomization] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('stripe');

  const pickupDate = localStorage.getItem('pickupDate');
  // const customization = localStorage.removeItem('customization');
  console.log('pickupDate', pickupDate);
  console.log('customization', customization);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const handleContinue = () => {
    if (currentStep === 0 && !myAddress) {
      return toast.error('Please add your address to continue.');
    }
    // if (currentStep === 1 && !pickupDate) {
    //   return toast.error('Please select a pickup date.');
    // }
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleNextStep = async (paymentMethodId: string) => {
    const res = await handleAsyncWithToast(async () => {
      return createOrder({
        paymentMethodId: paymentMethodId,
        customerId: me?.user?.userId,
        meals: currentMeal?._id,
        customization: customization || '',
        schedule: pickupDate,
        deliveryAddress: `House: ${myAddress?.houseNo}, Street: ${myAddress?.pickupStreet}, Zipcode: ${myAddress?.zipCode}, City: ${myAddress?.city}`,
      });
    }, 'Ordering...');
    console.log('res', res);
    if (res?.data?.success) {
      dispatch(clearCart());
      setCurrentStep((prev) => prev + 1);
      localStorage.removeItem('pickupDate');
      localStorage.removeItem('customization');
    }
  };

  // if (
  //   isLoading ||
  //   isFetching ||
  //   isSingleMealLoading ||
  //   isSingleMealFetching ||
  //   isMeLoading ||
  //   isMeFetching
  // ) {
  //   return <Loading />;
  // }

  if (!currentMeal) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center px-4">
        <Image
          src="https://i.ibb.co.com/nqNxgb86/empty-cart.png" // Replace with your actual image path
          alt="No meal selected"
          className="w-64 h-64 object-contain mb-6"
          width={256}
          height={256}
        />
        <p className="text-lg font-semibold text-gray-700">No meal selected</p>
      </div>
    );
  }

  return (
    <div className="py-10 px-4 max-w-5xl mx-auto">
      <Stepper currentStep={currentStep} />

      {currentStep === 0 && <AddAddress setCurrentStep={setCurrentStep} />}

      {currentStep === 1 && (
        <Card className="mx-auto border-none w-full max-w-xl shadow-lg rounded-2xl">
          <CardContent className="p-6 space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-bold uppercase text-primary tracking-wide">
                Summary
              </h2>
              <Separator className="mx-auto w-16" />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 sm:gap-8 text-sm">
              <div className="col-span-2 space-y-1">
                <span className="flex gap-2 items-end font-medium text-muted-foreground">
                  <MapPin size={30} />
                  <p className="text-2xl ">Pickup Location</p>
                </span>

                <div className=" overflow-x-auto mt-4 rounded border ">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100 text-muted-foreground">
                      <tr>
                        <th className="px-4 py-2">Field</th>
                        <th className="px-4 py-2">Value</th>
                      </tr>
                    </thead>
                    <tbody className="bg-background text-primary">
                      <tr className="border">
                        <td className="px-4 py-2 text-black font-medium">
                          House
                        </td>
                        <td className="px-4 py-2 text-gray-600">
                          {myAddress.data?.houseNo}
                        </td>
                      </tr>
                      <tr className="border">
                        <td className="px-4 py-2 text-black font-medium">
                          Street
                        </td>
                        <td className="px-4 py-2 text-gray-600">
                          {myAddress.data?.pickupStreet}
                        </td>
                      </tr>
                      <tr className="border">
                        <td className="px-4 py-2 text-black font-medium">
                          City
                        </td>
                        <td className="px-4 py-2 text-gray-600">
                          {myAddress.data?.city}
                        </td>
                      </tr>
                      <tr className="border">
                        <td className="px-4 py-2 text-black font-medium">
                          Zip Code
                        </td>
                        <td className="px-4 py-2 text-gray-600">
                          {myAddress.data?.zipCode}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-1 col-span-2">
                <h3 className="font-medium text-muted-foreground">
                  Customization
                </h3>
                <Input
                  type="text"
                  value={customization}
                  onChange={(e) => setCustomization(e.target.value)}
                  className="w-full border py-6 border-input rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Optional custom instructions"
                />
              </div>
              <div className="col-span-2">
                <h3 className="font-medium text-center text-muted-foreground">
                  Subtotal
                </h3>
                <p className="text-primary text-center font-semibold">
                  ${currentMeal?.price?.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="pt-4 grid gap-4 sm:grid-cols-2">
              <Button
                variant="outline"
                onClick={handleBack}
                className="w-full gap-2 py-6"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <Button onClick={handleContinue} className="w-full gap-2 py-6">
                Next <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <Card className="mx-auto w-full max-w-xl">
          <CardContent className="p-6 space-y-6">
            <h2 className="text-2xl font-semibold text-center text-primary uppercase">
              Select Payment Method
            </h2>
            <Separator />
            <div className="space-y-4 text-center">
              <Button
                variant={paymentMethod === 'stripe' ? 'default' : 'outline'}
                onClick={() => {
                  setPaymentMethod('stripe');
                  setTimeout(() => handleContinue(), 0); // ensures state is updated before navigating
                }}
                className={cn(
                  'w-full py-6 px-4 flex flex-col sm:flex-row items-center gap-4 sm:gap-2',
                  paymentMethod === 'stripe' && 'bg-primary text-white'
                )}
              >
                {/* Left Side: Text */}
                <span className="text-lg font-medium">Pay with Stripe</span>

                {/* Center: Card Icons */}
                <div className="flex items-center gap-2">
                  <Image
                    src={mar}
                    alt="Mastercard"
                    width={38}
                    height={24}
                    className="h-6 w-auto"
                  />
                  <Image
                    src={paypal}
                    alt="Visa"
                    width={38}
                    height={24}
                    className="h-6 w-auto"
                  />
                  <Image
                    src={amex}
                    alt="American Express"
                    width={38}
                    height={24}
                    className="h-6 w-auto"
                  />
                </div>

                {/* Right Side: Arrow Icon */}
                <ArrowRight className="w-6 h-6" />
              </Button>

              <Button
                variant="outline"
                onClick={handleBack}
                className="w-full py-6 "
              >
                <ArrowLeft /> Back
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 3 && (
        <div className="mx-auto w-full max-w-xl">
          <Elements stripe={stripePromise}>
            <StripeCardForm handleNextStep={handleNextStep} />
          </Elements>
          <div className="mt-6">
            <Button variant="outline" onClick={handleBack} className="w-full">
              Back
            </Button>
          </div>
        </div>
      )}

      {currentStep === 4 && (
        <Card className="mx-auto w-full max-w-xl text-center">
          <CardContent className="p-6 space-y-6">
            <h2 className="text-2xl font-semibold text-green-600">
              🎉 Payment Successful!
            </h2>
            <p className="text-muted-foreground">
              Thank you for your order. Youll receive an email confirmation
              shortly.
            </p>
            <Button
              onClick={() => (window.location.href = '/')}
              className="w-full"
            >
              Back to Home
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OrderMealPage;
