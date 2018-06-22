import React from 'react'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'
import Flex from 'styled-flex-component'

import { List } from './List'
import Loading from '../../../../../Partials/Loading'

import { getContact } from '../../../../../../models/contacts/get-contact'
import { getContactDeals } from '../../../../../../models/contacts/helpers/get-contact-deals'
import { normalizeContacts } from '../../../../../../store_actions/contacts/helpers/normalize-contacts'
// import SelectDealModal from '../../../../../../views/components/SelectDealModal'
// import ActionButton from '../../../../../../views/components/Button/ActionButton'

export class DealsListWidget extends React.Component {
  state = {
    // isOpen: false,
    contact: {},
    isLoading: false,
    list: []
  }

  componentDidMount() {
    if (this.props.contactId) {
      this.fetchDeals(this.props.contactId)
    }
  }

  fetchDeals = async id => {
    try {
      this.setState({ isLoading: true })

      const response = await getContact(id, {
        associations: [
          'contact.sub_contacts',
          'sub_contact.deals',
          'contact.summary',
          'sub_contact.users',
          'contact_attribute.attribute_def'
        ]
      })

      const list = getContactDeals(response.data)
      const normalizedContact = normalizeContacts(response)

      if (list) {
        this.setState({
          contact: normalizedContact.entities.contacts[id],
          list,
          isLoading: false
        })
      }
    } catch (error) {
      console.log(error)
      this.setState({ isLoading: false })
    }
  }

  // handleOnOpen = () => {
  //   this.setState({ isOpen: true })
  // }

  // handleOnClose = () => {
  //   this.setState({ isOpen: false })
  // }

  // handleSelectedItem = deal => {
  //   this.setState(
  //     prevState => ({ list: [...prevState.list, deal] }),
  //     this.handleOnClose
  //   )
  // }

  handleOnClickItem = deal => {
    if (!deal || !deal.id) {
      return
    }

    browserHistory.push(`/dashboard/deals/${deal.id}`)
  }

  render() {
    return (
      <div className="c-contact-profile-card stage">
        <h3 className="c-contact-profile-card__title">Deals</h3>
        <div className="c-contact-profile-card__body">
          {this.state.isLoading ? (
            <Loading style={{ margin: '4em auto' }} />
          ) : this.state.list.length > 0 ? (
            <List
              contact={this.state.contact}
              handleOnClickItem={this.handleOnClickItem}
              list={this.state.list}
            />
          ) : (
            <Flex center full style={{ height: '2em' }}>
              <div style={{ color: '#8da2b5' }}>
                No deals connected to this contact.
              </div>
            </Flex>
          )}
        </div>
      </div>
    )
  }
}

DealsListWidget.propTypes = {
  contactId: PropTypes.string.isRequired
}
