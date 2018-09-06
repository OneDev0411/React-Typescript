import React from 'react'
import Address from '../../../../components/address'

export default class AddressForm extends React.Component {
  render() {
    return (
      <Address
        show={this.props.isOpen || false}
        onClose={this.props.onClose}
        deal={this.props.deal}
      />
    )
  }
}
