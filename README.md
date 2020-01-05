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
      <PayFiat oceanAmount={50} currency="EUR"/>
    )
  }
}
```

## License

Apache 2.0 © [akshay-ap](https://github.com/akshay-ap)
