import { NewPaymentIntent } from "./models/NewPayementIntent";

const baseUrl = process.env.REACT_APP_PAYFIAT_SERVER_URL;

console.log(baseUrl);

const checkServerAvailability = () => {
  return window.fetch(`${baseUrl}/health`).then((res) => {
    if (res.status === 200) {
      return true;
    } else {
      return false;
    }
  });
};

const createPaymentIntent = (newPaymentIntent: NewPaymentIntent) => {
  return window
    .fetch(`${baseUrl}/fiat/create-payment-intent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(newPaymentIntent),
    })
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        return null;
      }
    })
    .then((data) => {
      if (!data || data.error) {
        console.log("API error:", { data });
        throw new Error("PaymentIntent API Error");
      } else {
        return { client_secret: data.client_secret, id: data.id };
      }
    });
};

const getPublicStripeKey = () => {
  return window
    .fetch(`${baseUrl}/fiat/public-key`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        return null;
      }
    })
    .then((data) => {
      if (!data || data.error) {
        console.log("API error:", { data });
        throw Error("API Error");
      } else {
        return data.publicKey;
      }
    });
};

const getTokenBalance = async (options: {
  token: string;
  senderAddress: string;
}) => {
  let { token, senderAddress } = options;
  let resp = await window.fetch(
    `${baseUrl}/crypto/balance?token=${token}&senderAddress=${senderAddress}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );

  return resp;
};

const getCurrentTokenPrice = async (options: {
  contractAddress: string;
  currency: string;
}): Promise<number | undefined> => {
  let { contractAddress, currency } = options;
  let res = await window.fetch(
    `${baseUrl}/crypto/currentPrice?contractAddress=${contractAddress}&currency=${currency}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );

  if (res.status === 200) {
    let data = await res.json();
    return data.price;
  } else {
    return undefined;
  }
};

const checkTxStatus = async (options: { txHash: string }) => {
  let { txHash } = options;
  let res = await window.fetch(
    `${baseUrl}/crypto/checkTxStatus?txHash=${txHash}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );

  let data = await res.json();
  return data;
};

const getTxHash = (paymentId: string) => {};

const api = {
  checkServerAvailability,
  createPaymentIntent,
  getPublicStripeKey,
  getTokenBalance,
  getCurrentTokenPrice,
  checkTxStatus,
  getTxHash,
};

export default api;
