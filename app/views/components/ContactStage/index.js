import React from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'
import { BasicDropdown } from '../BasicDropdown'

import { getContactAttribute } from '../../../models/contacts/helpers/get-contact-attribute'
import { selectDefinitionByName } from '../../../reducers/contacts/attributeDefs'

import {
  upsertContactAttributes,
  upsertAttributesToContacts,
  getContacts
} from '../../../store_actions/contacts'
import {
  selectContact,
  selectContactsInfo
} from '../../../reducers/contacts/list'

const defaultSelectedItem = { label: 'General', value: 'General' }

function getInitialSelectedItem(contact, attribute_def) {
  const stage = getContactAttribute(contact, attribute_def)
  let selectedItem = defaultSelectedItem

  if (stage.length > 0) {
    selectedItem = { label: stage[0].text, value: stage[0].text }
  }

  return selectedItem
}

function getItems(items) {
  return items.map(item => ({ label: item, value: item }))
}

class Stage extends React.Component {
  state = {
    isSaving: false
  }

  prepareStageAttribute = (contact, text) => {
    const is_primary = true
    const { attribute_def } = this.props
    let stage = getContactAttribute(contact, attribute_def)

    if (stage.length > 0 && stage[0].id) {
      stage = {
        text,
        is_primary,
        id: stage[0].id
      }
    } else {
      stage = {
        text,
        is_primary,
        attribute_def
      }
    }

    return stage
  }

  handleOnChange = async ({ value }) => {
    try {
      this.setState({ isSaving: true })

      const { contacts, ContactListStore } = this.props

      if (contacts.length === 1) {
        const contact = selectContact(ContactListStore, contacts[0])

        await this.props.upsertContactAttributes(contact.id, [
          this.prepareStageAttribute(contact, value)
        ])
      } else {
        const { attribute_def } = this.props
        const updatedContacts = contacts.map(contactId => {
          const contact = selectContact(ContactListStore, contactId)

          const contactStages = getContactAttribute(contact, attribute_def)
          const newStage = {
            text: value,
            attribute_def: attribute_def.id
          }

          if (contactStages.length > 0) {
            newStage.id = contactStages[0].id
          }

          return {
            id: contactId,
            attributes: [newStage]
          }
        })

        await this.props.upsertAttributesToContacts(updatedContacts)

        if (contacts.length >= 50) {
          await this.props.getContacts()
          this.props.resetSelectedRows()
        }
      }

      this.props.notify({
        status: 'success',
        message: `Contact${contacts.length > 1 ? 's' : ''} stage updated.`
      })
      this.setState({ isSaving: false })
    } catch (error) {
      console.error(error)
      this.setState({
        isSaving: false
      })
    }
  }

  itemToString = item => item.label

  render() {
    return (
      <BasicDropdown
        buttonSize={this.props.buttonSize}
        disabled={this.state.isSaving}
        fullWidth={this.props.fullWidth}
        items={getItems(this.props.attribute_def.enum_values)}
        itemToString={this.itemToString}
        onChange={this.handleOnChange}
        defaultSelectedItem={
          this.props.defaultSelectedItem ||
          getInitialSelectedItem(
            selectContact(this.props.ContactListStore, this.props.contacts[0]),
            this.props.attribute_def
          )
        }
        style={this.props.style}
      />
    )
  }
}

Stage.defaultProps = {
  fullWidth: true
}

function mapStateToProps(state) {
  const {
    contacts: { attributeDefs, list: ContactListStore }
  } = state
  const attribute_def = selectDefinitionByName(attributeDefs, 'stage')
  const filter = selectContactsInfo(ContactListStore).filter || []
  const searchText = selectContactsInfo(ContactListStore).searchText || ''

  return {
    attribute_def,
    ContactListStore,
    filter,
    searchText
  }
}

export default connect(
  mapStateToProps,
  {
    upsertContactAttributes,
    upsertAttributesToContacts,
    getContacts,
    notify
  }
)(Stage)
