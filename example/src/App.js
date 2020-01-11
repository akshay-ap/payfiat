import React, { Component } from 'react'

import { PayFiat } from 'payfiat'

export default class App extends Component {
  render() {
    return (
      <div>
        <PayFiat oceanAmount={200} currency="EUR" receiverAccount="0x5f410f5eE92D8BBE4df673ceef9D90B414B04f67" />
      </div>
    )
  }
}
