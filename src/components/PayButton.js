import React, { Component } from "react";

class PayButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      processing: false,
      disabled: false
    };
  }

  render() {
    return (
      <div>
        <button
          className="btn"
          id={this.props.type}
          disabled={this.state.disabled}
          onClick={this.props.onClick}
        >
          {this.state.processing
            ? "Processing…"
            : `Pay ${this.props.totalAmount} ${this.props.currency}`}
        </button>
      </div>
    );
  }
}

export default PayButton;
