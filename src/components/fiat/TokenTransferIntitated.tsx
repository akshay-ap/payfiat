import { CircularProgress, Link, Typography } from "@material-ui/core";
import React, { useEffect } from "react";
import api from "../../api";
import { usePayFiat } from "../../context/PayFiatContext";
import { PaymentState } from "../../models/PaymentState";
import sleep from "../../utils/sleep";

const TokenTransferIntitated = () => {
  const { env, setPaymentState, transactionHash } = usePayFiat();

  useEffect(() => {
    (async () => {
      if (transactionHash) {
        try {
          let count = 0;
          let result = { status: "unknown" };
          while (true) {
            await sleep(5000);
            count++;
            result = await api.checkTxStatus({ txHash: transactionHash });
            if (result.status === "success") {
              console.log(`TxHash found successful in [${count}] attempt`);
              setPaymentState(PaymentState.TokenTransferCompleted);
              break;
            } else if (result.status === "fail") {
              setPaymentState(PaymentState.FiatPaymentFailed);
              break;
            }
          }
        } catch (error) {}
      }
    })();
  }, [setPaymentState, transactionHash]);

  return (
    <>
      <Typography>Token transfer intitated.</Typography>
      <Typography>Waiting for Token transaction completion.</Typography>
      <Typography variant="caption">
        Transaction hash:{transactionHash}
      </Typography>
      <Typography>
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
      </Typography>

      <CircularProgress />
    </>
  );
};

export default TokenTransferIntitated;
