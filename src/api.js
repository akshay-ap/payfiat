const baseUrl = process.env.REACT_APP_PAYFIAT_SERVER_URL;

console.log(baseUrl);

const checkServerAvailability = options => {
  return window
    .fetch(`${baseUrl}/health`)
    .then(res => {
      if (res.status == 200) {
        return true;
      } else {
        return false;
      }
    });
}

const createPaymentIntent = options => {
  return window
    .fetch(`${baseUrl}/fiat/create-payment-intent`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(options)
    })
    .then(res => {
      if (res.status === 200) {
        return res.json();
      } else {
        return null;
      }
    })
    .then(data => {
      if (!data || data.error) {
        console.log("API error:", { data });
        throw new Error("PaymentIntent API Error");
      } else {
        return data.client_secret;
      }
    });
};

const getPublicStripeKey = options => {
  return window
    .fetch(`${baseUrl}/fiat/public-key`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(res => {
      if (res.status === 200) {
        return res.json();
      } else {
        return null;
      }
    })
    .then(data => {
      if (!data || data.error) {
        console.log("API error:", { data });
        throw Error("API Error");
      } else {
        return data.publicKey;
      }
    });
};

const getTokenBalance = async options => {
  let { token, senderAddress } = options;
  let resp = await window.fetch(
    `${baseUrl}/crypto/balance?token=${token}&senderAddress=${senderAddress}`,
    {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }
  );

  return resp;
};

const getCurrentOceanPrice = async options => {
  let { contractAddress, currency } = options;
  let res = await window.fetch(
    `${baseUrl}/crypto/currentPrice?contractAddress=${contractAddress}&currency=${currency}`,
    {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }
  );

  if (res.status === 200) {
    let data = await res.json();
    return data.price;
  } else {
    return res;
  }
}

const checkTxStatus = async options => {
  let { txHash } = options;
  let res = await window.fetch(
    `${baseUrl}/crypto/checkTxStatus?txHash=${txHash}`,
    {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }
  );

  let data = await res.json();
  return data;
}

const transferOCEAN = async options => {
  let { amount, receiverAddress } = options;
  let res = await window.fetch(
    `${baseUrl}/fiat/transfer-oceans?amount=${amount}&receiverAddress=${receiverAddress}`,
    {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }
  );

  if (res.status === 200) {
    let data = await res.json();
    return data.txHash;
  } else {
    let error = await res.json();
    return error;
  }
}
const api = {
  checkServerAvailability,
  createPaymentIntent,
  getPublicStripeKey,
  getTokenBalance,
  getCurrentOceanPrice,
  transferOCEAN,
  checkTxStatus
};

export default api;
