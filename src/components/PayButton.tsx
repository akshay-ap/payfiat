import { Button } from "@material-ui/core";
import React from "react";
import { usePayFiat } from "../context/PayFiatContext";

const PayButton = (props: {
  disabled: boolean;
  onClick: any;
  isProcessing: boolean;
}) => {
  const { disabled, onClick, isProcessing } = props;
  const { currency, priceInformation, tokenAmount } = usePayFiat();
  return (
    <div style={{ margin: "10px" }}>
      <Button
        disabled={disabled}
        onClick={onClick}
        color="primary"
        variant="contained"
      >
        {isProcessing
          ? "Processing…"
          : `Pay ${(priceInformation.price || 0) * tokenAmount} ${currency}`}
      </Button>
    </div>
  );
};

export default PayButton;
