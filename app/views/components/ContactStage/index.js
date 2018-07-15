import React from 'react'
import { connect } from 'react-redux'

import { BasicDropdown } from '../BasicDropdown'

import { getContactAttribute } from '../../../models/contacts/helpers/get-contact-attribute'
import { selectDefinitionByName } from '../../../reducers/contacts/attributeDefs'
import { upsertContactAttributes } from '../../../store_actions/contacts/upsert-contact-attributes'

const defaultSelectedItem = { label: 'General', value: 'General' }

class Stage extends React.Component {
  state = {
    isSaving: false
  }

  prepareStageAttribute = text => {
    const is_primary = true
    const { contact, attribute_def } = this.props
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

      await this.props.upsertContactAttributes(this.props.contact.id, [
        this.prepareStageAttribute(value)
      ])

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
        buttonStyle={this.props.buttonStyle}
        disabled={this.state.isSaving}
        fullWidth
        items={getItems(this.props.attribute_def.enum_values)}
        itemToString={this.itemToString}
        onChange={this.handleOnChange}
        defaultSelectedItem={getInitialSelectedItem(
          this.props.contact,
          this.props.attribute_def
        )}
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
