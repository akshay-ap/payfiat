import { createContext, useContext } from "react";

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
};

export const PayFiatContext = createContext<PayFiatContextType>(
  {} as PayFiatContextType
);
export const usePayFiat = () => useContext(PayFiatContext);
