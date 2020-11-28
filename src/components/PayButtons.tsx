import React, { useEffect, useState } from "react";
import api from "../api";
import { Dialog } from "@material-ui/core";
import PayButton from "./PayButton";
import FiatCheckout from "./FiatCheckout";
import { usePayFiat } from "../context/PayFiatContext";

const PayButtons = () => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const { currency, priceInformation, setPriceInformation } = usePayFiat();

  useEffect(() => {
    (async () => {
      try {
        const result = await api.getCurrentTokenPrice({
          contractAddress: "0x967da4048cd07ab37855c090aaf366e4ce1b9f48",
          currency: currency,
        });
        setPriceInformation({
          price: result,
          fectchedOn: new Date(),
          source: "coingecko",
        });
      } catch (error) {}
    })();
  }, [currency, setPriceInformation]);

  const getModal = () => {
    if (priceInformation.price)
      return (
        <Dialog open={isModalOpen} id="payfiat-dialog">
          <FiatCheckout />
        </Dialog>
      );
    else return <>Token price not defined</>;
  };

  const handleClick = () => {
    setModalOpen(!isModalOpen);
  };

  return (
    <>
      {isModalOpen ? (
        getModal()
      ) : (
        <PayButton
          disabled={false}
          isProcessing={false}
          onClick={() => handleClick()}
        />
      )}
    </>
  );
};

export default PayButtons;
