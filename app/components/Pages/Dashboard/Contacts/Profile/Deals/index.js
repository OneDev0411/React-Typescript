import React from 'react'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'

import { goTo } from '../../../../../../utils/go-to'

import { List } from './List'
import { Section } from '../components/Section'
import Loading from '../../../../../Partials/Loading'

import { getContact } from '../../../../../../models/contacts/get-contact'
import { getContactDeals } from '../../../../../../models/contacts/helpers/get-contact-deals'
import { normalizeContacts } from '../../../../../../store_actions/contacts/helpers/normalize-contacts'
import SelectDealModal from '../../../../../../views/components/SelectDealModal'

import { grey } from '../../../../../../views/utils/colors'

export class DealsListWidget extends React.Component {
  state = {
    isOpen: false,
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

  handleOnOpen = () => {
    this.setState({ isOpen: true })
  }

  handleOnClose = () => {
    this.setState({ isOpen: false })
  }

  handleSelectedItem = deal => {
    this.setState(
      prevState => ({ list: [...prevState.list, deal] }),
      this.handleOnClose
    )
  }

  handleOnClickItem = deal => {
    if (!deal || !deal.id) {
      return
    }

    goTo(
      `/dashboard/deals/${deal.id}`,
      `Contact - ${this.state.contact.display_name}`
    )
  }

  render() {
    return (
      <Section title="Deals">
        {/* <Section title="Deals" onEdit={this.handleOnOpen}> */}
        {this.state.isLoading ? (
          <Loading style={{ margin: '4em auto' }} />
        ) : this.state.list.length > 0 ? (
          <List
            contact={this.state.contact}
            handleOnClickItem={this.handleOnClickItem}
            list={this.state.list}
          />
        ) : (
          <Flex center full>
            <div style={{ color: grey.A900, padding: '0.5em 0 1.5em' }}>
              No deals connected to this contact.
            </div>
          </Flex>
        )}

        <SelectDealModal
          isOpen={this.state.isOpen}
          handleOnClose={this.handleOnClose}
          handleSelectedItem={this.handleOnClickItem}
          title="Add a deal"
        />
      </Section>
    )
  }
}

DealsListWidget.propTypes = {
  contactId: PropTypes.string.isRequired
}
