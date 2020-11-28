export interface NewPaymentIntent {
  amount: number;
  currency: string;
  description: string;
  shipping: any;
  payment_method_types: string[];
  metadata: {
    recieverAddress: string;
    price: number;
    tokenAmount: number;
    tokenId: string;
  };
  email: string;
}
