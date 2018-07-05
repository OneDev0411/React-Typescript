import React from 'react'
import { connect } from 'react-redux'

import { BasicDropdown } from '../BasicDropdown'

import { getContactAttribute } from '../../../models/contacts/helpers/get-contact-attribute'
import { selectDefinitionByName } from '../../../reducers/contacts/attributeDefs'
import { upsertContactAttributes } from '../../../store_actions/contacts/upsert-contact-attributes'

const ITEMS = [
  'General',
  'Unqualified Lead',
  'Qualified Lead',
  'Active',
  'Past Client'
]

const defaultSelectedItem = { label: 'General', value: 'General' }

class Stage extends React.Component {
  state = {
    isSaving: false,
    selectedItem: getInitialSelectedItem(
      this.props.contact,
      this.props.attribute_def
    )
  }

  handleOnChange = async selectedItem => {
    const { contact, attribute_def } = this.props

    try {
      this.setState({ isSaving: true, selectedItem })

      const { value: text } = selectedItem
      const is_primary = true
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

      await this.props.upsertContactAttributes(this.props.contact.id, [stage])

      this.setState({ isSaving: false })
    } catch (error) {
      console.error(error)
      this.setState({
        isSaving: false,
        selectedItem: getInitialSelectedItem(contact, attribute_def)
      })
    }
  }

  itemToString = item => item.label

  render() {
    return (
      <BasicDropdown
        buttonStyle={this.props.buttonStyle}
        disabled={this.state.isSaving}
        fullWidth
        items={getItems(ITEMS)}
        itemToString={this.itemToString}
        onChange={this.handleOnChange}
        selectedItem={this.state.selectedItem}
        style={this.props.style}
      />
    )
  }
}

export default connect(
  mapStateToProps,
  { upsertContactAttributes }
)(Stage)

function mapStateToProps(state) {
  const attribute_def = selectDefinitionByName(
    state.contacts.attributeDefs,
    'stage'
  )

  return {
    attribute_def
  }
}

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
