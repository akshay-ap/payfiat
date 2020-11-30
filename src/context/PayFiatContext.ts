import { createContext, useContext } from "react";
import { PaymentState } from "../models/PaymentState";

export type TokenPrice = {
  price: number | undefined;
  fectchedOn: Date | undefined;
  source: "coingecko";
};

export type PayFiatContextType = {
  tokenAmount: number;
  recieverAccount: string;
  priceInformation: TokenPrice;
  setPriceInformation: (priceInfotmation: TokenPrice) => void;
  currency: string;
  isModalOpen: boolean;
  setModalOpen: (modalOpen: boolean) => void;
  env: string;
  setEnv: (env: string) => void;
  paymentState: PaymentState;
  setPaymentState: (newState: PaymentState) => void;
  transactionHash: string | undefined;
  setTransactionHash: (txHash: string) => void;
};

export const PayFiatContext = createContext<PayFiatContextType>(
  {} as PayFiatContextType
);
export const usePayFiat = () => useContext(PayFiatContext);
