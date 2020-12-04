import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import { addNotification as notify } from 'components/notification'

import { confirmation as showMessageModal } from '../../../../../../store_actions/confirmation'

import { CONTACTS__IMPORT_CSV__STEP_MAP_FIELDS } from '../../../../../../constants/contacts'

import {
  updateWizardStep,
  uploadCsvFile,
  requestImportCsv,
  getWorkerState
} from '../../../../../../store_actions/contacts'

import ActionButton from '../../../../../../views/components/Button/ActionButton'
import CancelButton from '../../../../../../views/components/Button/CancelButton'

import Loading from '../../../../../Partials/Loading'

class UploadContacts extends React.Component {
  state = {
    isImporting: false,
    isImportFailed: false,
    importError: null
  }

  componentDidMount() {
    if (this.validate()) {
      this.startImporting()
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.handleWorkerStatus(nextProps.workerState)
  }

  /**
   *
   * @param {String} workerState - the worker state
   */
  handleWorkerStatus = workerState => {
    if (workerState === this.props.workerState) {
      return false
    }

    if (workerState === 'complete') {
      this.onFinish()
    } else if (workerState === 'failed') {
      this.onError({})
    }

    return false
  }

  /**
   * validates csv file and mappings before start importing to server
   */
  validate = () => {
    const { mappedFields } = this.props

    let isValid = _.some(mappedFields, field => field.definitionId)

    if (!isValid) {
      return this.onError({
        isValidationError: true,
        title: 'Validation Error',
        message:
          'You should connect at least one field to be able upload contacts'
      })
    }

    return isValid
  }

  /**
   * starts importing contact steps (including upload and import mappings)
   */
  startImporting = async () => {
    const { csvFileId } = this.props

    this.setState({
      isImporting: true,
      isImportFailed: false,
      importError: null
    })

    // checks whether should upload the csv file, or is uploaded already
    if (!csvFileId) {
      this.uploadFile()
    } else {
      this.importCsvMappings(csvFileId)
    }
  }

  /**
   * uploads the csv file on server
   */
  uploadFile = async () => {
    const { file, uploadCsvFile } = this.props

    try {
      const fileId = await uploadCsvFile(file)

      return this.importCsvMappings(fileId)
    } catch (e) {
      this.onError(e)
    }
  }

  /**
   * sends mappings and fileId to server to start creating contacts
   * @param {String} fileId - the file id uuid
   */
  importCsvMappings = async fileId => {
    const { mappedFields, requestImportCsv } = this.props

    try {
      await requestImportCsv(fileId, this.props.owner.id, mappedFields)
    } catch (e) {
      this.onError(e)
    }
  }

  /**
   * handles success scenarios
   */
  onFinish = () => {
    this.props.notify({
      title: 'Contacts Imported',
      message: `Awesome! You’ve imported ${this.props.rowsCount} contacts`,
      status: 'success'
    })

    window.location.href = '/dashboard/contacts'
  }

  /**
   * handles failure scenarios
   */
  onError = e =>
    this.setState({
      isImporting: false,
      isImportFailed: true,
      importError: {
        isValidationError: e.isValidationError === true,
        title: (e && e.title) || 'Import Failed',
        description: e.response ? e.response.body.message : e.message
      }
    })

  goBack = () =>
    this.props.updateWizardStep(CONTACTS__IMPORT_CSV__STEP_MAP_FIELDS)

  render() {
    const { isImporting, isImportFailed, importError } = this.state
    const { rowsCount } = this.props

    return (
      <div className="contact__import-csv--upload-info">
        {isImporting && (
          <div>
            <Loading />
            Uploading {rowsCount} contacts. It may take a few seconds.
          </div>
        )}

        {isImportFailed && (
          <div className="error-message">
            <div className="title">{importError.title}</div>

            <div className="description">{importError.description}</div>
            <div className="cta-buttons">
              <CancelButton onClick={this.goBack}>Properties</CancelButton>

              <ActionButton
                onClick={this.startImporting}
                disabled={importError.isValidationError === true}
              >
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

  return {
    ...importCsv,
    attributeDefs
  }
}

export default connect(mapStateToProps, {
  showMessageModal,
  updateWizardStep,
  requestImportCsv,
  uploadCsvFile,
  getWorkerState,
  notify
})(UploadContacts)
