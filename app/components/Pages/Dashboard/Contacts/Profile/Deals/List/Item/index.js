import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'
import _ from 'underscore'

import { getContactUsers, getContactAttribute } from 'models/contacts/helpers'
import { selectDefinitionByName } from 'reducers/contacts/attributeDefs'
import { formatPhoneNumber } from 'utils/helpers'
import Avatar from 'components/Avatar'
import { normalizeDeal } from 'views/utils/association-normalizers'

import {
  getField,
  getFormattedPrice,
  getStatus,
  getAddress
} from 'models/Deal/helpers/context'

import { goTo } from 'utils/go-to'

import { roleName } from '../../../../../Deals/utils/roles'

import { Container, Price, Status, Address, Role } from './styled'

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

  handleOnClickItem = () =>
    goTo(
      `/dashboard/deals/${this.props.item.id}`,
      `Contact - ${this.props.contact.display_name}`
    )

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
          contactPhones.some(async phoneNumber =>
            this.compareTwoPhoneNumber(
              phoneNumber.text,
              roles[index].phone_number
            )
          ))
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

    const clientTitle = ''
    const status = getStatus(item)
    const address = getAddress(item)
    const avatar = normalizeDeal(item, false).avatar

    const contactRoleName = roles.map(role => roleName(role.role)).join(', ')

    return (
      <Container onClick={this.handleOnClickItem}>
        <Avatar {...avatar} />
        <div style={{ marginLeft: '1rem', width: 'calc(100% - 3rem)' }}>
          <Flex alignCenter justifyBetween style={{ marginBottom: '0.5em' }}>
            <Price>{getPrice(item)}</Price>
            {status && <Status color={avatar.statusColor}>{status}</Status>}
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
