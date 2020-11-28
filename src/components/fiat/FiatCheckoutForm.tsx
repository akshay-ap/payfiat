import {
  Button,
  createStyles,
  makeStyles,
  Paper,
  TextField,
  Theme,
  Typography,
} from "@material-ui/core";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { StripeCardElementOptions } from "@stripe/stripe-js";
import React, { useEffect, useState } from "react";
import api from "../../api";
import { usePayFiat } from "../../context/PayFiatContext";
import { NewPaymentIntent } from "../../models/NewPayementIntent";
import ErrorMessage from "./ErrorMessage";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    cardElement: {
      margin: theme.spacing(2),
    },
    priceInfo: {
      margin: theme.spacing(2),
    },
    input: {
      [theme.breakpoints.up("sm")]: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        marginBottom: theme.spacing(1),
        marginLeft: theme.spacing(4),
        marginRight: theme.spacing(4),
      },
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      marginBottom: theme.spacing(1),
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    checkoutForm: {
      [theme.breakpoints.up("sm")]: {
        width: "500px",
      },
    },
  })
);

const CARD_OPTIONS: StripeCardElementOptions = {
  iconStyle: "solid",
  style: {
    base: {
      color: "#32325d",
      fontFamily: "Arial, sans-serif",
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#32325d",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

const FiatCheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const classes = useStyles();

  const {
    currency,
    tokenAmount,
    priceInformation,
    recieverAccount,
  } = usePayFiat();

  enum PaymentState {
    FiatPaymentInitiating = 0,
    FiatPymentInitiated = 1,
    FiatPaymentCompleted = 2,
    FiatPaymentFialed = 3,
    TokenTransferIntiating = 4,
    TokenTransferInitiated = 5,
    TokenTransferFailed = 6,
    TokenTransferCompleted = 7,
  }

  const [paymentState, setPaymentState] = useState<PaymentState>(
    PaymentState.FiatPaymentInitiating
  );

  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [disabled, setDisabled] = useState(false);
  const [paymentId, setpaymentId] = useState<string | undefined>();

  const [billingDetails, setBillingDetails] = useState({
    email: "",
    phone: "",
    name: "",
    address: "",
  });

  useEffect(() => {
    if (paymentState === PaymentState.FiatPaymentCompleted) {
    }
  }, [PaymentState.FiatPaymentCompleted, paymentState]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPaymentState(PaymentState.FiatPymentInitiated);

    if (!priceInformation.price) {
      setError("Token price not defined");
      return;
    }

    try {
      setProcessing(true);
      setDisabled(true);
      if (!stripe || !elements) {
        return;
      }
      const newPaymentIntent: NewPaymentIntent = {
        payment_method_types: ["card"],
        amount: Math.round(priceInformation.price * tokenAmount * 100),
        currency: currency,
        description: "test payment",
        shipping: {
          name: billingDetails.name,
          address: {
            line1: billingDetails.address,
            postal_code: "98140",
            city: "San Francisco",
            state: "CA",
            country: "US",
          },
        },
        metadata: {
          price: priceInformation.price,
          tokenAmount: tokenAmount,
          tokenId: "1",
          recieverAddress: recieverAccount,
        },
        email: billingDetails.email,
      };

      const { client_secret, id } = await api.createPaymentIntent(
        newPaymentIntent
      );
      setpaymentId(id);

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) return;

      const payload = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (payload.error) {
        setError(`Payment failed ${payload.error.message}`);
        setProcessing(false);
        setPaymentState(PaymentState.FiatPaymentFialed);
      } else {
        setError(null);
        setProcessing(false);
        setSucceeded(true);
        setPaymentState(PaymentState.FiatPaymentCompleted);
      }
    } catch (error) {
      setError(error.message);
      setProcessing(false);
      setPaymentState(PaymentState.FiatPaymentFialed);
    }
  };

  const getForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <Typography className={classes.priceInfo} align="center">{`Pay ${(
          (priceInformation.price || 0) * tokenAmount
        ).toLocaleString(navigator.language, {
          minimumFractionDigits: 2,
        })} ${currency} for ${tokenAmount} Tokens`}</Typography>

        <div className={classes.input}>
          <TextField
            id="name"
            fullWidth
            required
            label="Name"
            disabled={processing}
            variant="outlined"
            value={billingDetails.name}
            onChange={(e) => {
              setBillingDetails({ ...billingDetails, name: e.target.value });
            }}
          />
        </div>
        <div className={classes.input}>
          <TextField
            required
            id="email"
            fullWidth
            label="Email"
            disabled={processing}
            type="email"
            variant="outlined"
            value={billingDetails.email}
            onChange={(e) => {
              setBillingDetails({ ...billingDetails, email: e.target.value });
            }}
          />
        </div>
        <div className={classes.input}>
          <TextField
            required
            id="address"
            fullWidth
            label="Address"
            disabled={processing}
            type="text"
            variant="outlined"
            value={billingDetails.address}
            onChange={(e) => {
              setBillingDetails({ ...billingDetails, address: e.target.value });
            }}
          />
        </div>
        <div className={classes.input}>
          <Paper style={{ padding: "2px" }}>
            <CardElement
              options={CARD_OPTIONS}
              className={classes.cardElement}
            />
          </Paper>
        </div>
        <div className={classes.input}>
          <Button
            fullWidth
            id="button-submit"
            disabled={processing || disabled || succeeded}
            type="submit"
            variant="contained"
            color="primary"
          >
            {processing ? <>Processing...</> : <>Pay</>}
          </Button>
        </div>
        {error && (
          <ErrorMessage>
            <>{error}</>
          </ErrorMessage>
        )}
        {succeeded ? (
          <Typography align="center">Payment succeeded</Typography>
        ) : null}
      </form>
    );
  };

  return (
    <div className={classes.checkoutForm} id="form-div">
      {paymentState <= PaymentState.FiatPaymentFialed ? (
        <>{getForm()}</>
      ) : (
        <> {succeeded && paymentId}?Checking token transfer status:</>
      )}
    </div>
  );
};

export default FiatCheckoutForm;
