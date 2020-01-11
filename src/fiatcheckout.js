import React, { Component } from "react";
import { Elements, StripeProvider } from "react-stripe-elements";
import FiatCheckoutForm from "./components/fiat/FiatCheckoutForm";
import api from "./api";

class FiatCheckout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      apiKey: null,
      payable: null
    };
  }

  componentDidMount() {
    api.getPublicStripeKey().then(apiKey => {
      this.setState({
        apiKey: apiKey
      });
    });
  }


  render() {
    return (
      <div className="checkout">
        {this.state.apiKey && (
          <StripeProvider apiKey={this.state.apiKey}>
            <Elements>
              <FiatCheckoutForm
                totalAmount={this.props.totalAmount}
                currency={this.props.currency}
                closeModal={this.props.closeModal.bind(this)}
                oceanAmount={this.props.oceanAmount}
                receiverAccount={this.props.receiverAccount}
              />
            </Elements>
          </StripeProvider>
        )}
      </div>
    );
  }
}

export default FiatCheckout;
