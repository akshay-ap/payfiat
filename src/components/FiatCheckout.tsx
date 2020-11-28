import { CircularProgress } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import api from "../api";
import FiatCheckoutForm from "./fiat/FiatCheckoutForm";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || "");

const FiatCheckout = () => {
  const [apiKey, setApiKey] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const result = await api.getPublicStripeKey();

        setApiKey(result);
      } catch (error) {
        setApiKey(undefined);
        console.error(error);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <CircularProgress />;
  else {
    return (
      <>
        {apiKey ? (
          <Elements stripe={stripePromise}>
            <FiatCheckoutForm />
          </Elements>
        ) : (
          <CircularProgress />
        )}
      </>
    );
  }
};

export default FiatCheckout;
