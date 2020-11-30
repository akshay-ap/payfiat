import { Button, Link, Typography } from "@material-ui/core";
import React from "react";
import { usePayFiat } from "../../context/PayFiatContext";

const TokenTransferSuccessful = () => {
  const { setModalOpen, transactionHash, env } = usePayFiat();

  return (
    <>
      <Typography align="center">Tokens successfully transferred.</Typography>
      <Typography variant="caption">
        Transaction hash:{transactionHash}
      </Typography>
      <Link
        target="_blank"
        href={
          env === "production"
            ? `https://etherscan.io/tx/${transactionHash}`
            : `https://rinkeby.etherscan.io//tx/${transactionHash}`
        }
      >
        Click here to view on etherscan
      </Link>
      <Typography align="center">
        Please refresh page to make another transaction.
      </Typography>
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

export default TokenTransferSuccessful;
