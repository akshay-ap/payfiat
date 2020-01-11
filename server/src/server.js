require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const { fiatRouter, cryptoRouter } = require("./routes");

app.use(bodyParser.json());

// configure CORS headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

app.use(
  express.json({
    // We need the raw body to verify webhook signatures.
    // Let's compute it only when hitting the Stripe webhook endpoint.
    verify: function (req, res, buf) {
      if (req.originalUrl.startsWith("/webhook")) {
        req.rawBody = buf.toString();
      }
    }
  })
);

//routes
app.use("/fiat", fiatRouter);
app.use("/crypto", cryptoRouter);

app.get("/", (req, res) => {
  res.send("Hello from API");
});

app.listen(process.env.PORT || 4242, () =>
  console.log(`Node server listening on port ${process.env.PORT || 4242}!`)
);
