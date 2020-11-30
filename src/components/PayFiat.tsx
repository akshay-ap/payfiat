import { CircularProgress } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import api from "../api";
import { PayFiatContext, TokenPrice } from "../context/PayFiatContext";
import { PaymentState } from "../models/PaymentState";
import PayButtons from "./PayButtons";

const PayFiat = (props: {
  erc20Amount: number;
  currency: string;
  receiverAddress: string;
}) => {
  const { erc20Amount, currency, receiverAddress } = props;
  const [isSeverAvailable, setIsServerAvailable] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [env, setEnv] = useState<string>("");
  const [paymentState, setPaymentState] = useState<PaymentState>(
    PaymentState.FiatPaymentInitiating
  );

  const [priceInformation, setPriceInformation] = useState<TokenPrice>(
    {} as TokenPrice
  );
  const [recieverAccount] = useState<string>(receiverAddress);

  const [transactionHash, setTransactionHash] = useState<string | undefined>();

  useEffect(() => {
    (async () => {
      try {
        let result = await api.checkServerAvailability();
        setIsServerAvailable(result);
        const env = await api.getEnv();
        setEnv(env);
      } catch (error) {
        setIsServerAvailable(false);
      }
      setLoading(false);
    })();
  }, []);

  const getButton = () => {
    return (
      <PayFiatContext.Provider
        value={{
          recieverAccount,
          tokenAmount: erc20Amount,
          currency: currency,
          setPriceInformation,
          priceInformation,
          isModalOpen,
          setModalOpen,
          env,
          setEnv,
          paymentState,
          setPaymentState,
          transactionHash,
          setTransactionHash,
        }}
      >
        {isSeverAvailable ? <PayButtons /> : <>Server unavailable</>}
      </PayFiatContext.Provider>
    );
  };

  return <>{loading ? <CircularProgress /> : getButton()}</>;
};

export default PayFiat;
