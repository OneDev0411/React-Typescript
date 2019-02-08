import React from 'react'
import { connect } from 'react-redux'

import { getContactAddresses } from 'models/contacts/helpers/get-contact-addresses'

import { selectDefsBySection } from 'reducers/contacts/attributeDefs'

import { AddressField } from './AddressField'
import { Section } from '../components/Section'
import { getAddresses, generateEmptyAddress } from './helpers/get-addresses'

class Addresses extends React.Component {
  constructor(props) {
    super(props)

    const addressAttributeDefs = selectDefsBySection(
      props.attributeDefs,
      'Addresses'
    )

    const addresses = getContactAddresses(props.contact)

    this.state = {
      addresses: [
        ...getAddresses(addresses, addressAttributeDefs),
        generateEmptyAddress(addressAttributeDefs, addresses.length)
      ]
    }

    this.addressAttributeDefs = addressAttributeDefs
  }

  addNewAddress = event => {
    if (event && event.stopPropagation) {
      event.stopPropagation()
    }

    this.setState(state => ({
      addresses: [
        ...state.addresses,
        generateEmptyAddress(this.addressAttributeDefs, state.addresses.length)
      ]
    }))
  }

  handleDelete = () => {
    console.log('delete from father')
  }

  handleSubmit = async values => {
    console.log('submit from father', values)

    return null
  }

  preSaveFormat = (values, originalValues) => {
    console.log('preSaveFormat from father ', values, originalValues)

    return values
  }

  render() {
    return (
      <Section title="Addresses" isNew>
        {this.state.addresses.map((field, index) => (
          <AddressField
            key={index}
            field={field}
            handleAddNew={this.addNewAddress}
          />
        ))}
      </Section>
    )
  }
}

function mapStateToProps(state) {
  return {
    attributeDefs: state.contacts.attributeDefs
  }
}

export default connect(mapStateToProps)(Addresses)
