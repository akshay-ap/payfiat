import React from "react";
import PayFiat from "./components/PayFiat";

function App() {
  return (
    <PayFiat
      erc20Amount={2}
      receiverAddress="0x58EdDe7Fb5d4d97A6DA34E54305EEC20A459fd93"
      currency="EUR"
    />
  );
}

export default App;
