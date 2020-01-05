import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'

console.log(process.env.REACT_APP_PAYFIAT_SERVER_URL)
ReactDOM.render(<App />, document.getElementById('root'))
