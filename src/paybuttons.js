import React, { Component } from "react";
import PayButton from "./components/PayButton";
import {
  Modal,
  ModalBody,
  ModalHeader
} from "reactstrap";
import api from "./api";
import FiatCheckout from "./fiatcheckout";


class PayButtons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      fiat: true,
      payable: null,
      showCloseButton: false
    };
  }

  componentDidMount() {
    api.getCurrentOceanPrice({ contractAddress: "0x967da4048cd07ab37855c090aaf366e4ce1b9f48", currency: this.props.currency }).then(price => {
      this.setState({
        payable: price
      });
    });
  }

  showClosebutton() {
    this.setState({ showCloseButton: true })
  }

  handleClick(type) {
    if (type == "fiat") {
      this.setState({
        fiat: true,
        modal: !this.state.modal
      });
    } else {
      this.setState({
        fiat: false,
        modal: !this.state.modal
      });
    }
  }
  //toggle modal dialog visibility
  toggle = () => this.setState({ modal: !this.state.modal });

  closeBtn = () => <button className="close" onClick={this.toggle.bind(this)}>&times;</button>
  renderModal() {
    return (
      <Modal
        isOpen={this.state.modal}
        toggle={this.toggle.bind(this)}
        className={this.props.className}
        keyboard={false}
        backdrop={'static'}
      >
        {this.state.showCloseButton ? (
          <ModalHeader charCode="X" style={{ border: 'none', background: 'none' }} toggle={this.toggle.bind(this)}></ModalHeader>
        ) : ""}

        <ModalBody style={{ margin: 'auto' }}>
          <FiatCheckout
            totalAmount={(this.state.payable * this.props.oceanAmount).toFixed(2)}
            currency={this.props.currency}
            receiverAccount={this.props.receiverAccount}
            closeModal={(shouldClose => this.setState({ modal: shouldClose }))}
            oceanAmount={this.props.oceanAmount}
            closeModal={this.showClosebutton.bind(this)}
          />

        </ModalBody>
      </Modal>
    );
  }

  render() {
    return (
      <div>
        {this.state.modal ? (
          this.renderModal()
        ) : (
            <div style={styles.container}>
              {this.state.payable ?
                (<PayButton type="fiat" totalAmount={(this.state.payable * this.props.oceanAmount).toFixed(2)} currency={this.props.currency} onClick={() => this.handleClick("fiat")} />)
                : ""}
            </div>
          )}
      </div>
    );
  }
}

const styles = {
  container: {
    margin: 'auto'
  }
};

export default PayButtons;
