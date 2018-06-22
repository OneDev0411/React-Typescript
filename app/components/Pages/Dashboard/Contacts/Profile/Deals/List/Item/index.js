import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Flex from 'styled-flex-component'
import { getStatusColor } from '../../../../../../../../utils/listing'
import * as Deal from '../../../../../../../../models/Deal/context-helper'
import { roleName } from '../../../../../Deals/utils/roles'
import {
  getContactUsers,
  getContactAttribute
} from '../../../../../../../../models/contacts/helpers'
import { selectDefinitionByName } from '../../../../../../../../reducers/contacts/attributeDefs'

const Container = styled.div`
  display: flex;
  margin: 0 -0.5em 0.5em;
  padding: 0.5em;

  &:last-of-type {
    margin-bottom: 0;
  }

  &:hover {
    cursor: pointer;
    background-color: #f5f5f5;
  }
`

const Price = styled.b`
  font-size: 1.5rem;
  line-height: 1;
  margin-right: 1em;
  font-weight: bold;
  color: #1e364b;
`

const Status = styled.span`
  line-height: 1;
  color: ${props => `#${getStatusColor(props.status)}`};
`

const Address = styled.div`
  color: #758a9e;
`

const Role = styled.div`
  color: #758a9e;
  font-weight: 600;
  margin-bottom: 0.5em;
`

function getPhoto(deal) {
  return Deal.getField(deal, 'photo') || '/static/images/deals/home.png'
}

function getPrice(deal) {
  const price =
    Deal.getField(deal, 'sales_price') ||
    Deal.getField(deal, 'list_price') ||
    Deal.getField(deal, 'lease_price')

  return Deal.getFormattedPrice(price) || '$0'
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

    const {
      PhoneNumberUtil
    } = await import('google-libphonenumber' /* webpackChunkName: "glpn" */)
    const phoneUtil = PhoneNumberUtil.getInstance()

    try {
      let phoneNumber1 = phoneUtil.parse(phone1, 'US')
      let phoneNumber2 = phoneUtil.parse(phone2, 'US')

      return (
        phoneNumber1.getNationalNumber() === phoneNumber2.getNationalNumber()
      )
    } catch (error) {
      return false
    }
  }

  render() {
    const { item, handleOnClickItem } = this.props
    const { roles } = this.state

    const status = Deal.getStatus(item) || 'Unknown'
    const clientTitle = ''
    const address = Deal.getAddress(item)

    const contactRoleName = roles.map(role => roleName(role.role)).join(', ')

    return (
      <Container onClick={() => handleOnClickItem(item)}>
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
