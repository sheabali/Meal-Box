import React, { useState, FormEvent } from 'react';
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  //   PaymentMethod,
} from '@stripe/react-stripe-js';

const StripeCardForm = ({
  handleNextStep,
}: {
  handleNextStep: (paymentMethodId: string) => Promise<void>;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardHolderName, setCardHolderName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethodId, setPaymentMethodId] = useState<string | null>(null);

  console.log(paymentMethodId);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      setError('Stripe is not initialized.');
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardNumberElement);
    if (!cardElement) {
      setError('Card details not entered.');
      setLoading(false);
      return;
    }

    // Create a PaymentMethod
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: { name: cardHolderName },
    });

    if (error) {
      setError(error.message as string);
      setLoading(false);
    } else {
      if (paymentMethod && paymentMethod.id) {
        setPaymentMethodId(paymentMethod?.id);
        if (paymentMethod?.id) {
          handleNextStep(paymentMethod.id);
        }
      }
      // console.log('PaymentMethod Created:', paymentMethod);
      setLoading(false);
      // Send paymentMethod.id to your backend for further processing
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 max-w-md mx-auto bg-white shadow-lg rounded-lg"
    >
      <div className="mb-4">
        <label className="block font-semibold mb-2">Cardholder Name</label>
        <input
          type="text"
          defaultValue={cardHolderName}
          onChange={(e) => setCardHolderName(e.target.value)}
          className="w-full border py-1 px-2 rounded-md"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-2">Card Number</label>

        <div className="border p-2 rounded-md">
          <CardNumberElement className="w-full" />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="w-1/2">
          <label className="block font-semibold mb-2">Expiry Date</label>
          <div className="border p-2 rounded-md">
            <CardExpiryElement className="w-full" />
          </div>
        </div>

        <div className="w-1/2">
          <label className="block font-semibold mb-2">CVC</label>
          <div className="border p-2 rounded-md">
            <CardCvcElement className="w-full" />
          </div>
        </div>
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="mt-4 bg-primary text-white px-4 py-2 rounded-md w-full"
      >
        {loading ? 'Processing...' : 'Confirm Order'}
      </button>

      {paymentMethodId && (
        <p className="text-green-500 mt-2">
          Payment Method Created: {paymentMethodId}
        </p>
      )}
    </form>
  );
};

export default StripeCardForm;
