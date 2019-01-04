import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'
import _ from 'underscore'

import { getContactUsers, getContactAttribute } from 'models/contacts/helpers'
import { selectDefinitionByName } from 'reducers/contacts/attributeDefs'
import { formatPhoneNumber } from 'utils/helpers'

import {
  getField,
  getFormattedPrice,
  getStatus,
  getAddress
} from 'models/Deal/helpers/context'

import { roleName } from '../../../../../Deals/utils/roles'

import { Container, Price, Status, Address, Role } from './styled'

function getPhoto(deal) {
  return getField(deal, 'photo') || '/static/images/deals/home.png'
}

function getPrice(deal) {
  const price =
    getField(deal, 'sales_price') ||
    getField(deal, 'list_price') ||
    getField(deal, 'lease_price')

  return getFormattedPrice(price) || '$0'
}

class Item extends React.Component {
  state = {
    roles: []
  }

  componentDidMount() {
    this.searchRoles()
  }

  searchRoles = async () => {
    const { item, contact, attributeDefs } = this.props
    const { roles } = item
    let matchedRoles = []
    const emailAttDef = selectDefinitionByName(attributeDefs, 'email')
    const phoneAttDef = selectDefinitionByName(attributeDefs, 'phone_number')
    const contactUsers = getContactUsers(contact)
    const contactEmails = getContactAttribute(contact, emailAttDef)
    const contactPhones = getContactAttribute(contact, phoneAttDef)

    // todo: refactor
    for (let index = 0; index < roles.length; index++) {
      if (
        (roles[index].user &&
          _.find(contactUsers, ({ id }) => id === roles[index].user.id)) ||
        (roles[index].email &&
          _.find(contactEmails, ({ id }) => id === roles[index].email)) ||
        (roles[index].phone_number &&
          (await this.compareTwoPhoneNumber(
            contactPhones,
            roles[index].phone_number
          )))
      ) {
        matchedRoles.push(roles[index])
      }
    }

    this.setState({ roles: matchedRoles })
  }

  compareTwoPhoneNumber = async (phone1, phone2) => {
    if (phone1 === phone2) {
      return true
    }

    const phoneNumber1 = await formatPhoneNumber(phone1)
    const phoneNumber2 = await formatPhoneNumber(phone2)

    return phoneNumber1 === phoneNumber2
  }

  render() {
    const { item } = this.props
    const { roles } = this.state

    const status = getStatus(item) || 'Unknown'
    const clientTitle = ''
    const address = getAddress(item)

    const contactRoleName = roles.map(role => roleName(role.role)).join(', ')

    return (
      <Container onClick={() => this.props.handleOnClickItem(item)}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%' }}>
          <img src={getPhoto(item)} alt="home" style={{ width: '100%' }} />
        </div>
        <div style={{ paddingLeft: '2rem' }}>
          <Flex alignCenter style={{ marginBottom: '0.5em' }}>
            <Price>{getPrice(item)}</Price>
            <Status status={status}>{status}</Status>
          </Flex>
          {clientTitle && (
            <div>
              <b>{clientTitle}</b>
            </div>
          )}
          {contactRoleName && <Role>{contactRoleName}</Role>}
          {address && <Address>{address}</Address>}
        </div>
      </Container>
    )
  }
}

Item.propTypes = {
  contact: PropTypes.shape().isRequired,
  item: PropTypes.object.isRequired,
  handleOnClickItem: PropTypes.func.isRequired
}

function mapStateToProps({ contacts }) {
  const { attributeDefs } = contacts

  return {
    attributeDefs
  }
}

export default connect(mapStateToProps)(Item)
