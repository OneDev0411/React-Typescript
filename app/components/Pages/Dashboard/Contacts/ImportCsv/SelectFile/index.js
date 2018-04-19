import React from 'react'
import { connect } from 'react-redux'
import Dropzone from 'react-dropzone'
import { batchActions } from 'redux-batched-actions'
import cn from 'classnames'
import { confirmation as showMessageModal } from '../../../../../../store_actions/confirmation'
import {
  addCsvFile,
  updateWizardStep,
  setCurrentStepValidation
} from '../../../../../../store_actions/contacts'
import { CONTACTS__IMPORT_CSV__STEP_UPLOAD_FILE } from '../../../../../../constants/contacts'

class SelectFile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isDropzoneActive: false
    }
  }

  onDropFiles = files => {
    if (files.length === 0) {
      return this.props.showMessageModal({
        message: 'Invalid File',
        description: 'You are only allowed to import csv files',
        hideCancelButton: true,
        confirmLabel: 'Okay',
        onConfirm: () => null
      })
    }

    batchActions([
      this.props.addCsvFile(files[0]),
      this.props.updateWizardStep(CONTACTS__IMPORT_CSV__STEP_UPLOAD_FILE),
      this.props.setCurrentStepValidation(true)
    ])

    this.setState({
      isDropzoneActive: false
    })
  }

  getDropZoneMessage = () => {
    const { isDropzoneActive } = this.state
    const { file } = this.props

    if (file && !isDropzoneActive) {
      return file.name
    }

    return isDropzoneActive
      ? 'Drop the CSV file here'
      : 'Drag and drop a CSV file here to upload'
  }

  render() {
    const { isDropzoneActive } = this.state
    const { file } = this.props

    return (
      <div className="contact__import-csv--select-file">
        <Dropzone
          className={cn('contact__import-csv--select-file__dropzone', {
            isActive: isDropzoneActive,
            hasFile: file !== null
          })}
          disableClick
          ref={ref => (this.dropzone = ref)}
          onDrop={files => this.onDropFiles(files)}
          onDragEnter={() => this.setState({ isDropzoneActive: true })}
          onDragLeave={() => this.setState({ isDropzoneActive: false })}
          accept=".csv"
        >
          <div className="inner">
            <img
              src={`/static/images/contacts/${
                file ? 'checkbox' : 'upload'
              }.svg`}
              alt=""
            />

            <p>{this.getDropZoneMessage()}</p>

            <div>
              {!file && <p>Or</p>}
              <span className="link" onClick={() => this.dropzone.open()}>
                {file ? 'Change File' : 'Select a file'}
              </span>
            </div>
          </div>
        </Dropzone>
      </div>
    )
  }
}

function mapStateToProps({ contacts }) {
  const { importCsv } = contacts
  const { file } = importCsv

  return {
    file
  }
}

export default connect(mapStateToProps, {
  addCsvFile,
  updateWizardStep,
  showMessageModal,
  setCurrentStepValidation
})(SelectFile)
