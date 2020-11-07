import React, { Component } from 'react'

import { PayFiat } from 'payfiat'

export default class App extends Component {
  render() {
    return (
      <div>
        <PayFiat oceanAmount={200} currency="EUR" receiverAccount="0x58EdDe7Fb5d4d97A6DA34E54305EEC20A459fd93" />
      </div>
    )
  }
}
