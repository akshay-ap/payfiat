import React, { Component } from "react";
import { CardElement, injectStripe } from "react-stripe-elements";
import { UncontrolledTooltip } from "reactstrap";
import Web3 from "web3";
import Checkmark from "../Checkmark";
import Crossmark from "../Crossmark";
import "./FiatCheckoutForm.css";
import api from "../../api";

const web3 = new Web3(Web3.givenProvider);

class FiatCheckoutForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: 0,
      currency: "",
      clientSecret: null,
      error: null,
      metadata: null,
      disabled: false,
      paymentSuccessful: false,
      processing: false,
      hidePaymentSuccessful: false,
      hasTransferInitiated: false,
      transferProcessComplete: false,
      tokenTransferError: null,
      transferSuccessful: null,
      transferFailed: null,
      tooltipOpen: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {

    if (!web3.currentProvider) {
      this.setState({ web3Connected: false }); //Unlock your metamask
      return;
    } else {
      this.setState({ web3Connected: true });

      let _accounts = await web3.eth.getAccounts();
      console.log(_accounts[0]);

      this.setState({
        amount: this.props.totalAmount,
        currency: this.props.currency,
        currentAccount: _accounts[0]
      });

    }
  }

  async componentDidUpdate() {
    if (this.state.hidePaymentSuccessful
      && !this.state.hasTransferInitiated) {
      console.log("Sending token transfer request..")
      let resp = await api.transferOCEAN({
        receiverAddress: this.state.currentAccount,
        amount: this.props.oceanAmount
      })
      if (resp.message) {
        this.setState({
          hasTransferInitiated: true,
          tokenTransferError: resp.message
        })
      }
      else {
        console.log(`TxHash - ${resp.txHash}`)
        //start checking for transaction receipt
        setInterval(function () { this.checkForTokenTransferState(resp.txHash) }.bind(this), 5000);
        this.setState({
          hasTransferInitiated: true,
          tokenTransferError: null
        })
      }
    }
  }

  async checkForTokenTransferState(txHash) {
    try {
      let receipt = await web3.eth.getTransactionReceipt(txHash);
      if (receipt && receipt.status) {
        this.setState({
          transferSuccessful: true,
          transferFailed: false,
          transferProcessComplete: true
        })
      } else if (receipt && receipt.status == false) {
        this.setState({
          transferFailed: true,
          transferSuccessful: false,
          transferProcessComplete: true
        })
      }
    } catch (err) {
      console.error(`Transfer receipt error - ${err.message}`)
      this.setState({
        tokenTransferError: err.message
      })
    }
  }

  async handleSubmit(ev) {
    ev.preventDefault();

    // Step 1: Create PaymentIntent over Stripe API
    api
      .createPaymentIntent({
        payment_method_types: ["card"],
        amount: Math.round(this.state.amount * 100),
        currency: this.state.currency
      })
      .then(clientSecret => {
        this.setState({
          clientSecret: clientSecret,
          disabled: true,
          processing: true
        });

        // Step 2: Use clientSecret from PaymentIntent to handle payment in stripe.handleCardPayment() call
        this.props.stripe
          .handleCardPayment(this.state.clientSecret)
          .then(payload => {
            if (payload.error) {
              this.setState({
                error: `Payment failed: ${payload.error.message}`,
                disabled: false,
                processing: false
              });
              console.log("[error]", payload.error);
            } else {
              this.setState({
                processing: false,
                paymentSuccessful: true,
                error: "",
                metadata: payload.paymentIntent
              });
              console.log("[PaymentIntent]", payload.paymentIntent);
            }
          });
      })
      .catch(err => {
        this.setState({ error: err.message });
      });
  }

  async initiateTokenTransfer() {
    this.setState({ hidePaymentSuccessful: true });
  }


  renderTokenTransferSuccessful() {
    setTimeout(function () { this.props.closeModal() }.bind(this), 200);
    return (
      <div>
        <Checkmark loadComplete={this.state.transferSuccessful} />
        <p>Successfully transferred {this.props.oceanAmount} OCEANs to {this.state.currentAccount}</p>
      </div>
    )
  }

  renderTokenTransferFailed() {
    setTimeout(function () { this.props.closeModal() }.bind(this), 200);
    return (
      <div>
        <Crossmark />
        <p style={{ color: 'red' }}>❌😰 Transfer of {this.props.oceanAmount} OCEANs to {this.state.currentAccount} failed</p>
      </div>
    )
  }

  renderPaymentSuccessful() {
    return (
      <div className="payment-success" >
        <Checkmark loadComplete={this.state.paymentSuccessful} />
        <p>Payment successful 💰💰</p>
        <button onClick={this.initiateTokenTransfer.bind(this)}> Send me {this.props.oceanAmount} OCEAN 🦑</button>
      </div >
    )
  }

  renderTransferingTokens() {
    console.log("initiate Token transfer")
    return (
      <div className="payment-success">
        <Checkmark loadComplete={this.state.transferProcessComplete} />
        <p>Transferring {this.props.oceanAmount} OCEAN to</p>
        <h6>{this.state.currentAccount}</h6>
      </div>
    );
  }

  toggleTooltip() {
    this.setState({ tooltipOpen: !this.state.tooltipOpen })
  }

  renderForm() {
    var style = {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4"
        }
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a"
      }
    };
    return (
      <form onSubmit={this.handleSubmit}>
        <h3 style={{ marginBottom: '10px', textAlign: 'center' }}>
          {this.state.currency.toLocaleUpperCase()}{" "}
          {this.state.amount.toLocaleString(navigator.language, {
            minimumFractionDigits: 2
          })}{" "}
        </h3>
        <p>
          <span id="price">{`Pay ${this.props.totalAmount} ${this.props.currency} for ${this.props.oceanAmount} OCEAN`}</span>
          {"  "}
          <span>
            <a
              style={{ color: "rgb(123, 17, 115)" }}
              href="https://www.coingecko.com/en/coins/ocean-protocol"
              target="_blank"
            >
              verify price?
            </a>
            <UncontrolledTooltip style={{ backgroundColor: "rgb(123, 17, 115)" }} placement="right" target="account">
              {this.props.oceanAmount} OCEANs will be delivered to this account. This is non-reversible transaction.
            </UncontrolledTooltip>
          </span>
          <br />
          <span id="account" style={{ color: "rgb(123, 17, 115)" }}> ⚠ {this.state.currentAccount}</span>
        </p>

        <div className="sr-combo-inputs">
          <div className="sr-combo-inputs-row">
            <input
              type="text"
              id="name"
              placeholder="Name"
              autoComplete="cardholder"
              className="sr-input"
              required
            />
          </div>

          <div className="sr-combo-inputs-row">
            <CardElement className="sr-input sr-card-element" style={style} />
          </div>
        </div>

        {this.state.error && (
          <div className="message sr-field-error">{this.state.error}</div>
        )}

        {!this.state.paymentSuccessful && (
          <button className="btn" disabled={this.state.disabled}>
            {this.state.processing
              ? "Processing…"
              : `Pay ${this.props.totalAmount} ${this.props.currency}`}
          </button>
        )}
      </form>
    );
  }

  toggle = () => this.setState({ modal: !this.state.modal });

  render() {

    let { transferSuccessful, transferProcessComplete, paymentSuccessful, hidePaymentSuccessful, transferFailed } = this.state;
    return (
      <div className="checkout-form">
        <div className="sr-payment-form">
          {//if token transfer tx successful
            transferSuccessful && transferProcessComplete ? this.renderTokenTransferSuccessful() :
              //if token transfer tx failed  
              (transferFailed && transferProcessComplete ? this.renderTokenTransferFailed() :
                //if trying to intiate token transfer  
                (paymentSuccessful && !transferProcessComplete && hidePaymentSuccessful ? this.renderTransferingTokens() :
                  //if trying to render successful payment       
                  (paymentSuccessful && !hidePaymentSuccessful ? this.renderPaymentSuccessful() : (
                    //render payment form
                    !paymentSuccessful ? this.renderForm() : ''
                  ))))}
        </div>
      </div>
    );
  }
}

export default injectStripe(FiatCheckoutForm);
