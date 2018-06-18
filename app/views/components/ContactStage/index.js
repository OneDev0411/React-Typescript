import React from 'react'
import { connect } from 'react-redux'

import { BasicDropdown } from '../BasicDropdown'

import { getContactStage } from '../../../models/contacts/helpers/get-contact-stage'
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
    selectedItem: getInitialSelectedItem(this.props.contact)
  }

  handleOnChange = async selectedItem => {
    try {
      this.setState({ isSaving: true, selectedItem })

      const { value: text } = selectedItem

      const attribute_def = selectDefinitionByName(
        this.props.attributeDefs,
        'stage'
      )
      const is_primary = true
      let stage = getContactStage(this.props.contact)

      if (stage && stage.id) {
        stage = {
          text,
          is_primary,
          id: stage.id
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
        selectedItem: getInitialSelectedItem(this.props.contact)
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

export default connect(mapStateToProps, { upsertContactAttributes })(Stage)

function mapStateToProps(state) {
  return {
    attributeDefs: state.contacts.attributeDefs
  }
}

function getInitialSelectedItem(contact) {
  const stage = getContactStage(contact)
  let selectedItem = defaultSelectedItem

  if (stage != null) {
    selectedItem = { label: stage.text, value: stage.text }
  }

  return selectedItem
}

function getItems(items) {
  return items.map(item => ({ label: item, value: item }))
}
