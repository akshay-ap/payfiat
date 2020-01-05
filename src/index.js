import React, { Component } from "react";
import PayButtons from "./paybuttons.js";
import "./index.css";

import "./assets/vendor/nucleo/css/nucleo.css";
import "./assets/vendor/font-awesome/css/font-awesome.min.css";
import "./assets/scss/argon-design-system-react.scss";


export class PayFiat extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App" >
        <div className="sr-root">
          <div className="sr-main">
            <PayButtons oceanAmount={this.props.oceanAmount || 100} currency={this.props.currency || 'EUR'} />
          </div>
        </div>
      </div>
    );
  }

}

