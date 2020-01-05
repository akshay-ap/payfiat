import React, { Component } from 'react'

import { PayFiat } from 'payfiat'

export default class App extends Component {
  render() {
    return (
      <div>
        <PayFiat oceanAmount={105} currency="EUR" />
      </div>
    )
  }
}
