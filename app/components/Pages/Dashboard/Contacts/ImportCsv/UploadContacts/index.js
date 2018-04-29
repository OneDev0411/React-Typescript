import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import moment from 'moment'
import { addNotification as notify } from 'reapop'
import { confirmation as showMessageModal } from '../../../../../../store_actions/confirmation'
import postNewContacts from '../../../../../../models/contacts/post-new-contact'
import { updateWizardStep } from '../../../../../../store_actions/contacts'
import { CONTACTS__IMPORT_CSV__STEP_MAP_FIELDS } from '../../../../../../constants/contacts'
import {
  selectDefinition,
  selectDefinitionByName
} from '../../../../../../reducers/contacts/attributeDefs'
import { isAddressField } from '../helpers/address'
import Loading from '../../../../../Partials/Loading'

class UploadContacts extends React.Component {
  state = {
    isImporting: false
  }

  componentDidMount() {
    if (this.validate()) {
      this.uploadContacts()
    }
  }

  validate = () => {
    const { mappedFields, attributeDefs } = this.props
    let errorMessage

    let isValid = _.some(mappedFields, field => field.definitionId)

    if (!isValid) {
      this.onError(
        'You should connect at least one field to be able upload contacts',
        'Validation Error'
      )

      return false
    }

    isValid = _.every(mappedFields, (field, csvField) => {
      const definition = selectDefinition(attributeDefs, field.definitionId)

      if (definition && definition.has_label && !field.label) {
        errorMessage = `Select a label for "${csvField}" field`
        this.onError(errorMessage, 'Validation Error')

        return false
      }

      return true
    })

    return isValid
  }

  getIndex = () => {}

  uploadContacts = async () => {
    const { rows, columns, mappedFields, attributeDefs } = this.props
    const contacts = []

    _.each(rows, row => {
      const contact = {
        attributes: []
      }

      _.each(mappedFields, ({ definitionId, label, index = 0 }, csvField) => {
        const definition = selectDefinition(attributeDefs, definitionId)
        const fieldValue = row[columns[csvField].index].trim()
        const parsedValue = this.parseValue(
          csvField,
          definition.name,
          fieldValue
        )

        const contactItem = {
          attribute_def: definitionId,
          [definition.data_type]: parsedValue
        }

        if (label) {
          contactItem.label = label
        }

        if (isAddressField(attributeDefs, definitionId)) {
          contactItem.index = index + 1
        }

        contact.attributes.push(contactItem)
      })

      contacts.push(this.getNormalizedContact(contact))
    })

    try {
      await postNewContacts(contacts)
      this.onFinish()
    } catch (e) {
      this.onError(e.response ? e.response.body.message : e.message)
    } finally {
      this.setState({
        isImporting: false
      })
    }
  }

  getNormalizedContact = contact => {
    const { attributeDefs } = this.props

    const sourceDefinition = selectDefinitionByName(
      attributeDefs,
      'source_type'
    )

    contact.attributes.push({
      attribute_def: sourceDefinition.id,
      [sourceDefinition.data_type]: 'CSV'
    })

    return contact
  }

  parseValue = (csvField, fieldName, value) => {
    switch (fieldName) {
      case 'birthday':
        return moment(value).unix() // unix timestamp in seconds

      case 'phone':
        return value.replace(/\s/g, '').replace(/^00/, '+')

      case 'note':
        return `${csvField}: ${value}`
    }

    return value
  }

  onFinish = () => {
    this.props.notify({
      title: 'Contacts Imported',
      message: `Awesome! You’ve imported ${this.props.rowsCount} contacts`,
      status: 'success'
    })

    window.location.href = '/dashboard/contacts'
  }

  onError = (errorMessage, title) => {
    this.props.showMessageModal({
      message: title || 'Something Wrong',
      description: errorMessage,
      hideCancelButton: true,
      confirmLabel: 'Okay',
      onConfirm: () =>
        this.props.updateWizardStep(CONTACTS__IMPORT_CSV__STEP_MAP_FIELDS)
    })
  }

  render() {
    const { isImporting } = this.state
    const { rowsCount } = this.props

    return (
      <div className="contact__import-csv--upload-info">
        <Loading />
        {isImporting && (
          <span>
            Uploading {rowsCount} contacts. It may takes a few seconds.
          </span>
        )}
      </div>
    )
  }
}

function mapStateToProps({ contacts }) {
  const { importCsv, attributeDefs } = contacts
  const { columns, rows, mappedFields, rowsCount } = importCsv

  return {
    attributeDefs,
    rowsCount,
    mappedFields,
    columns,
    rows
  }
}

export default connect(mapStateToProps, {
  showMessageModal,
  updateWizardStep,
  notify
})(UploadContacts)
