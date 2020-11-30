import { Button, Typography } from "@material-ui/core";
import React from "react";
import { usePayFiat } from "../../context/PayFiatContext";
import ErrorMessage from "./ErrorMessage";

const ErrorFiatPaymentFailed = ({ error }: { error: string | null }) => {
  const { setModalOpen } = usePayFiat();

  return (
    <>
      <Typography align="center">Payment failed</Typography>
      <ErrorMessage>{error}</ErrorMessage>
      <Button
        fullWidth
        onClick={() => setModalOpen(false)}
        variant="contained"
        color="primary"
      >
        Close
      </Button>
    </>
  );
};

export default ErrorFiatPaymentFailed;
