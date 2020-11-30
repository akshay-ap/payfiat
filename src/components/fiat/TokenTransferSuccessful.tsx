import { Button, Link, Typography } from "@material-ui/core";
import React from "react";
import { usePayFiat } from "../../context/PayFiatContext";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

const TokenTransferSuccessful = () => {
  const { setModalOpen, transactionHash, env } = usePayFiat();

  return (
    <>
      <Typography align="center" variant="h5">
        Tokens successfully transferred
      </Typography>
      <CheckCircleIcon style={{ fill: "green" }} />
      <Typography align="center" variant="h6">
        Transaction hash
      </Typography>
      <Typography variant="caption">{transactionHash}</Typography>
      <br />
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
        style={{ width: "75%" }}
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
