require("dotenv").config();
const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Web3 = require("web3");
let web3 = new Web3(process.env.INFURA_NODE);
const { sendTx } = require("../utils/signer");
const abi = require("../abi/token.json");
const { parseAmount } = require("../utils/formatter");

router.get("/public-key", (req, res) => {
  console.log(`pub key - ${process.env.STRIPE_PUBLISHABLE_KEY}`);
  res.send({ publicKey: process.env.STRIPE_PUBLISHABLE_KEY });
});

router.post("/create-payment-intent", async (req, res) => {
  const body = req.body;
  const options = {
    ...body
  };
  console.log(options)

  try {
    const paymentIntent = await stripe.paymentIntents.create(options);
    res.status(200).json(paymentIntent);
  } catch (err) {
    res.status(500).json(err);
    console.error(err.message);
  }
});


router.get("/transfer-oceans", async (req, res) => {
  const { receiverAddress, amount } = req.query;
  let oceanContractAddress = process.env.OCEAN_CONTRACT_ADDRESS;

  try {
    //create token instance from abi and contract address
    const tokenInstance = new web3.eth.Contract(abi, oceanContractAddress);
    let amt = parseAmount(amount).toString();
    console.log(amt)
    var txData = await tokenInstance.methods.transfer(receiverAddress, amt).encodeABI();
    let txHash = await sendTx(txData, process.env.OCEAN_FROM_ADDRESS, oceanContractAddress, 0);
    res.status(201).json({ txHash });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.error(err.message);
  }
});

// Webhook handler for asynchronous events.
router.post("/webhook", async (req, res) => {
  let data;
  let eventType;
  // Check if webhook signing is configured.
  if (process.env.STRIPE_WEBHOOK_SECRET) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    let signature = req.headers["stripe-signature"];

    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log(`⚠️ Webhook signature verification failed.`);
      return res.sendStatus(400);
    }
    // Extract the object from the event.
    data = event.data;
    eventType = event.type;
  } else {
    // Webhook signing is recommended, but if the secret is not configured in `config.js`,
    // retrieve the event data directly from the request body.
    data = req.body.data;
    eventType = req.body.type;
  }

  if (eventType === "payment_intent.succeeded") {
    // Fulfill any orders, e-mail receipts, etc
    console.log("💰 Payment received!");
  }

  if (eventType === "payment_intent.payment_failed") {
    // Notify the customer that their order was not fulfilled
    console.log("❌ Payment failed.");
  }

  res.sendStatus(200);
});

module.exports = router;
