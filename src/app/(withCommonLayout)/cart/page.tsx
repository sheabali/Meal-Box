/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Check } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import StripeCardForm from '@/components/modules/pages/order-meal/StripeCardForm';
import AddAddress from '@/components/modules/pages/order-meal/AddAddress';

import { createOrder, getAddress } from '@/services/order';

import { clearCart, currentProduct } from '@/redux/features/cartSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { handleAsyncWithToast } from '@/utils/handleAsyncWithToast';
import { useUser } from '@/context/UserContext';

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

  const [pickupDate, setPickupDate] = useState('');
  const [customization, setCustomization] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('stripe');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const handleContinue = () => {
    if (currentStep === 0 && !myAddress) {
      return toast.error('Please add your address to continue.');
    }
    if (currentStep === 1 && !pickupDate) {
      return toast.error('Please select a pickup date.');
    }
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

  return (
    <div className="py-10 px-4 max-w-5xl mx-auto">
      <Stepper currentStep={currentStep} />

      {currentStep === 0 && <AddAddress setCurrentStep={setCurrentStep} />}

      {currentStep === 1 && (
        <Card className="mx-auto w-full max-w-xl">
          <CardContent className="p-6 space-y-6">
            <h2 className="text-2xl font-semibold text-center text-primary uppercase">
              Summary
            </h2>
            <Separator />
            <div className="space-y-4 text-center">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Pickup Location
                </h3>
                <p className="text-primary">
                  {`House: ${myAddress.data?.houseNo} Street: ${myAddress.data?.pickupStreet} City: ${myAddress.data?.city}`}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Zip code
                </h3>
                <p className="text-primary">{myAddress.data?.zipCode}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Customization
                </h3>
                <input
                  type="text"
                  value={customization}
                  onChange={(e) => setCustomization(e.target.value)}
                  className="w-full border rounded px-3 py-2 text-sm"
                  placeholder="Optional custom instructions"
                />
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Pickup Date
                </h3>
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Subtotal
                </h3>
                <p className="text-primary font-semibold">
                  ${currentMeal?.price?.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="space-y-4 pt-4">
              <Button onClick={handleContinue} className="w-full">
                Next
              </Button>
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === (0 as number)}
                className="w-full"
              >
                Back
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
                onClick={() => setPaymentMethod('stripe')}
                className="w-full"
              >
                Pay with Card (Stripe)
              </Button>
              {/* You can add more payment options here */}
            </div>
            <div className="space-y-4 pt-4">
              <Button onClick={handleContinue} className="w-full">
                Next
              </Button>
              <Button variant="outline" onClick={handleBack} className="w-full">
                Back
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
