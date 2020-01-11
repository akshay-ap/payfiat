# payfiat

> React component to allow users to pay for Ocean Protocol assets in fiat currency

[![NPM](https://img.shields.io/npm/v/payfiat.svg)](https://www.npmjs.com/package/payfiat) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save payfiat
```

## Usage

```jsx
import React, { Component } from 'react'

import {PayFiat} from 'payfiat'

class Example extends Component {
  render () {
    return (
      <PayFiat 
      oceanAmount={50} 
      currency="EUR" 
      receiverAccount="0xB4Ba48998CF672d43b8216D43EE8f16143c9055C"
      />
    )
  }
}
```
> **Note** - if `receiverAccount` prop is not provided, then ethereum account address is exported from injected web3 provided like Metamask.

## License

Apache 2.0 © [akshay-ap](https://github.com/akshay-ap)
