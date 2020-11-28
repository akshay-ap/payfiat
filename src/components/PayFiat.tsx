import { CircularProgress } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import api from "../api";
import { PayFiatContext, TokenPrice } from "../context/PayFiatContext";
import PayButtons from "./PayButtons";

const PayFiat = (props: {
  erc20Amount: number;
  currency: string;
  receiverAddress: string;
}) => {
  const { erc20Amount, currency, receiverAddress } = props;
  const [isSeverAvailable, setIsServerAvailable] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [priceInformation, setPriceInformation] = useState<TokenPrice>(
    {} as TokenPrice
  );
  const [recieverAccount, setRecieverAccount] = useState<string>(
    receiverAddress
  );

  useEffect(() => {
    (async () => {
      try {
        let result = await api.checkServerAvailability();
        setIsServerAvailable(result);
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
        }}
      >
        {isSeverAvailable ? <PayButtons /> : <>Server unavailable</>}
      </PayFiatContext.Provider>
    );
  };

  return <>{loading ? <CircularProgress /> : getButton()}</>;
};

export default PayFiat;
