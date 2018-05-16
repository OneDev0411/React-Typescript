import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import moment from 'moment'
import { addNotification as notify } from 'reapop'

import { confirmation as showMessageModal } from '../../../../../../store_actions/confirmation'

import { createContacts } from '../../../../../../store_actions/contacts/create-contacts'

import { updateWizardStep } from '../../../../../../store_actions/contacts'
import { CONTACTS__IMPORT_CSV__STEP_MAP_FIELDS } from '../../../../../../constants/contacts'

import ActionButton from '../../../../../../views/components/Button/ActionButton'
import CancelButton from '../../../../../../views/components/Button/CancelButton'

import {
  selectDefinition,
  selectDefinitionByName
} from '../../../../../../reducers/contacts/attributeDefs'
import { isAddressField } from '../helpers/address'
import Loading from '../../../../../Partials/Loading'

class UploadContacts extends React.Component {
  state = {
    isImporting: false,
    isImportFailed: false,
    importErrorMessage: null
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

  uploadContacts = async () => {
    const {
      rows,
      columns,
      mappedFields,
      attributeDefs,
      createContacts
    } = this.props
    const contacts = []

    this.setState({
      isImporting: true,
      isImportFailed: false,
      importErrorMessage: null
    })

    _.each(rows, row => {
      const contact = {
        attributes: []
      }

      _.each(mappedFields, ({ definitionId, label, index = 0 }, csvField) => {
        if (!definitionId) {
          return false
        }

        const definition = selectDefinition(attributeDefs, definitionId)

        const fieldValue = row[columns[csvField].index].trim()
        const parsedValue = this.parseValue(
          csvField,
          definition.name,
          fieldValue
        )

        if (parsedValue === null) {
          return false
        }

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
      await createContacts(contacts, { relax: true })
      this.onFinish()
    } catch (e) {
      this.onError(e)
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
        return value && moment(value).isValid() ? moment(value).unix() : null

      case 'phone':
        return value && value.replace(/\s/g, '').replace(/^00/, '+')

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

  onError = e =>
    this.setState({
      isImportFailed: true,
      importErrorMessage: {
        title: 'Upload Failed',
        description: e.response ? e.response.body.message : e.message
      }
    })

  goBack = () =>
    this.props.updateWizardStep(CONTACTS__IMPORT_CSV__STEP_MAP_FIELDS)

  render() {
    const { isImporting, isImportFailed, importErrorMessage } = this.state
    const { rowsCount } = this.props

    return (
      <div className="contact__import-csv--upload-info">
        {isImporting && (
          <div>
            <Loading />
            Uploading {rowsCount} contacts. It may takes a few seconds.
          </div>
        )}

        {isImportFailed && (
          <div className="error-message">
            <div className="title">{importErrorMessage.title}</div>

            <div className="description">{importErrorMessage.description}</div>
            <div className="cta-buttons">
              <CancelButton onClick={this.goBack}>Properties</CancelButton>

              <ActionButton onClick={this.uploadContacts}>
                Try Again
              </ActionButton>
            </div>
          </div>
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
  createContacts,
  notify
})(UploadContacts)
