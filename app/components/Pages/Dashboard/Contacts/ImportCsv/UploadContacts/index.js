import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import _ from 'underscore'
import moment from 'moment'
import { addNotification as notify } from 'reapop'
import { confirmation as showMessageModal } from '../../../../../../store_actions/confirmation'
import { fields as contactFields } from '../FieldDropDown'
import {
  uploadCsvContacts,
  updateWizardStep
} from '../../../../../../store_actions/contacts'
import { CONTACTS__IMPORT_CSV__STEP_MAP_FIELDS } from '../../../../../../constants/contacts'
import Loading from '../../../../../Partials/Loading'

class UploadContacts extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isImporting: false
    }
  }

  componentDidMount() {
    if (this.validate()) {
      this.uploadContacts()
    }
  }

  validate = () => {
    const { mappedFields } = this.props
    let errorMessage

    let isValid = _.some(mappedFields, mapData => mapData.field)

    if (!isValid) {
      this.onError(
        'You should connect at least one field to be able upload contacts',
        'Validation Error'
      )

      return false
    }

    const indexedContactFields = _.indexBy(contactFields, 'value')

    isValid = _.every(mappedFields, (mapData, csvField) => {
      if (indexedContactFields[mapData.field].hasLabel && !mapData.label) {
        errorMessage = `Select a label for "${csvField}" field`
        this.onError(errorMessage, 'Validation Error')

        return false
      }

      return true
    })

    return isValid
  }

  uploadContacts = async () => {
    const { rows, columns, mappedFields, uploadCsvContacts } = this.props
    const indexedContactFields = _.indexBy(contactFields, 'value')
    const contacts = []

    rows.forEach(row => {
      const contact = {
        attributes: {}
      }

      _.each(mappedFields, (mapData, csvField) => {
        const { field: rechatField, label } = mapData

        // ignore unmapped fields
        if (rechatField === null) {
          return false
        }

        const fieldInfo = columns[csvField]
        const fieldValue = row[fieldInfo.index].trim()
        const { pluralName, singularName, dataType } = indexedContactFields[
          rechatField
        ]

        if (!fieldValue) {
          return false
        }

        if (!contact.attributes[pluralName]) {
          contact.attributes[pluralName] = []
        }

        contact.attributes[pluralName][label] = {
          ...contact.attributes[pluralName][label],
          type: singularName,
          label,
          [rechatField]: this.parseValue(rechatField, dataType, fieldValue)
        }
      })

      contacts.push(this.getNormalizedContact(contact))
    })

    this.setState({
      isImporting: true
    })

    try {
      await uploadCsvContacts(contacts)
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
    const normalizedContact = {
      attributes: {}
    }

    _.each(contact.attributes, (fields, pluralName) => {
      normalizedContact.attributes[pluralName] = _.values(fields)

      const contactField = contactFields.find(
        item => item.pluralName === pluralName
      )

      if (contactField.hasLabel) {
        normalizedContact.attributes[pluralName][0].is_primary = true
      }
    })

    if (!normalizedContact.attributes.source_types) {
      normalizedContact.attributes.source_types = [
        {
          type: 'source_type',
          source_type: 'CSV'
        }
      ]
    }

    return normalizedContact
  }

  parseValue = (fieldName, dataType, value) => {
    switch (fieldName) {
      case 'birthday':
        return moment(value).unix() // unix timestamp in seconds

      case 'phone':
        return value.replace(/\s/g, '').replace(/^00/, '+')
    }

    return value
  }

  onFinish = () => {
    browserHistory.push('/dashboard/contacts')

    this.props.notify({
      title: 'Contacts Imported',
      message: `Awesome! You’ve imported ${this.props.rowsCount} contacts`,
      status: 'success'
    })
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
  const { importCsv } = contacts
  const { columns, rows, mappedFields, rowsCount } = importCsv

  return {
    rowsCount,
    mappedFields,
    columns,
    rows
  }
}

export default connect(mapStateToProps, {
  uploadCsvContacts,
  showMessageModal,
  updateWizardStep,
  notify
})(UploadContacts)
