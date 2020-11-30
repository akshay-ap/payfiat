import {
  Button,
  CircularProgress,
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
import { PaymentState } from "../../models/PaymentState";
import sleep from "../../utils/sleep";
import ErrorFiatPaymentFailed from "./ErrorFiatPaymentFailed";
import ErrorMessage from "./ErrorMessage";
import TokenTransferIntitated from "./TokenTransferIntitated";
import TokenTransferSuccessful from "./TokenTransferSuccessful";

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
        height: "355px",
      },
      textAlign: "center",
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
    paymentState,
    setPaymentState,
    setTransactionHash,
  } = usePayFiat();

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
    (async () => {
      if (paymentId && paymentState === PaymentState.FiatPaymentCompleted) {
        try {
          let count = 0;
          let result = { txState: "unknown", transactionHash: "unknown" };
          while (result.txState !== "started") {
            await sleep(5000);
            count++;
            result = await api.getTxHash(paymentId);
            if (result.txState === "started") {
              console.log(`Txstate found updated in [${count}] attempt`);
            }
          }

          setTransactionHash(result.transactionHash);
          setPaymentState(PaymentState.TokenTransferInitiated);
        } catch (error) {
          setError(error.message);
        }
      }
    })();
  }, [paymentState, paymentId, setPaymentState, setTransactionHash]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPaymentState(PaymentState.FiatPaymentInitiated);

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
        setError(`${payload.error.message}`);
        setProcessing(false);
        setPaymentState(PaymentState.FiatPaymentFailed);
      } else {
        setError(null);
        setProcessing(false);
        setSucceeded(true);
        setPaymentState(PaymentState.FiatPaymentCompleted);
      }
    } catch (error) {
      setError(error.message);
      setProcessing(false);
      setPaymentState(PaymentState.FiatPaymentFailed);
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

  const getContent = () => {
    if (paymentState === PaymentState.FiatPaymentFailed) {
      return <ErrorFiatPaymentFailed error={error} />;
    } else if (
      paymentState === PaymentState.FiatPaymentInitiating ||
      paymentState === PaymentState.FiatPaymentInitiated
    ) {
      return <>{getForm()}</>;
    } else if (paymentState === PaymentState.FiatPaymentCompleted) {
      return (
        <>
          <Typography>
            Payment completed. Waiting for Token transaction confirmation.
          </Typography>
          <CircularProgress />
        </>
      );
    } else if (paymentState === PaymentState.TokenTransferInitiated) {
      return <TokenTransferIntitated />;
    } else if (paymentState === PaymentState.TokenTransferCompleted) {
      return <TokenTransferSuccessful />;
    }
    return <>Invalid state</>;
  };

  return (
    <div className={classes.checkoutForm} id="form-div">
      {getContent()}
    </div>
  );
};

export default FiatCheckoutForm;
