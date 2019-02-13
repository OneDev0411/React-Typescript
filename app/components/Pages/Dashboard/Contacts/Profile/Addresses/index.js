import React from 'react'
import { connect } from 'react-redux'

import { getContactAddresses } from 'models/contacts/helpers/get-contact-addresses'
import { upsertContactAttributes } from 'models/contacts/helpers/upsert-contact-attributes'

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

  handleSubmit = async attributes => {
    try {
      const updatedContact = await upsertContactAttributes(
        this.props.contact.id,
        attributes,
        {
          associations: [
            'contact.sub_contacts',
            'contact_attribute.attribute_def'
          ]
        }
      )

      const addresses = getContactAddresses(updatedContact)

      this.setState({
        addresses: [
          ...getAddresses(addresses, this.addressAttributeDefs),
          generateEmptyAddress(this.addressAttributeDefs, addresses.length)
        ]
      })
    } catch (error) {
      console.error(error)
    }
  }

  render() {
    return (
      <Section title="Addresses" isNew>
        {this.state.addresses.map((address, index) => (
          <AddressField
            key={index}
            address={address}
            handleSubmit={this.handleSubmit}
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
