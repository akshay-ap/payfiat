import React, { Component } from "react";
import PayButtons from "./paybuttons.js";
import api from "./api";

import "./index.css";
import "./assets/vendor/nucleo/css/nucleo.css";
import "./assets/vendor/font-awesome/css/font-awesome.min.css";
import "./assets/scss/argon-design-system-react.scss";


export class PayFiat extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isServerOk: false,
      isServerCheckOngoing: true
    }
  }

  async componentDidMount() {
    if (!this.state.isServerOk) {
      let resp = await api.checkServerAvailability();
      this.setState({
        isServerOk: resp,
        isServerCheckOngoing: false
      })
    }
  }

  renderInProgress() {
    return (
      <h6> Checking PayFiat Server availability...</h6>
    )
  }

  renderServerUnavailable() {
    return (
      <h6 style={{ color: 'red' }}> PayFiat server unavailable. Make sure Server is up and running and endpoint in configured correctly in .env file...</h6>
    )
  }

  renderPayFiat() {
    return (
      <PayButtons
        oceanAmount={this.props.oceanAmount || 100}
        currency={this.props.currency || 'EUR'}
        receiverAccount={this.props.receiverAccount} />
    )
  }

  render() {
    return (
      <div className="App" >
        <div className="sr-root">
          <div className="sr-main">
            {this.state.isServerCheckOngoing ?
              this.renderInProgress() :
              (this.state.isServerOk ?
                this.renderPayFiat() :
                this.renderServerUnavailable())}
          </div>
        </div>
      </div>
    );

  }

}

