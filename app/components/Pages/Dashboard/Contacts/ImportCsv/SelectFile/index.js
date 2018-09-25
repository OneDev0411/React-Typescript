import React from 'react'
import { connect } from 'react-redux'
import Dropzone from 'react-dropzone'
import { batchActions } from 'redux-batched-actions'
import cn from 'classnames'
import Flex from 'styled-flex-component'

import { confirmation as showMessageModal } from '../../../../../../store_actions/confirmation'
import {
  addCsvFile,
  updateWizardStep,
  setCurrentStepValidation
} from '../../../../../../store_actions/contacts'
import { CONTACTS__IMPORT_CSV__STEP_UPLOAD_FILE } from '../../../../../../constants/contacts'
import { getActiveTeam } from '../../../../../../utils/user-teams'
import { H1 } from '../../../../../../views/components/Typography/headings'
import InfoIcon from '../../../../../../views/components/SvgIcons/InfoOutline/IconInfoOutline'
import Tooltip from '../../../../../../views/components/tooltip'
import { TeamContactSelect } from '../../../../../../views/components/TeamContact/TeamContactSelect'
import { primary } from '../../../../../../views/utils/colors'

class SelectFile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isDropzoneActive: false
    }

    this.activeTeam = getActiveTeam(props.owner)
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
      <div style={{ margin: '0 auto', maxWidth: '48em' }}>
        <Flex center style={{ padding: '4em 0' }}>
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
        </Flex>

        <div style={{ marginBottom: '4em' }}>
          <p>Importing To</p>
          <Flex alignCenter style={{ marginBottom: '2em' }}>
            <H1>
              {this.activeTeam &&
                this.activeTeam.brand &&
                this.activeTeam.brand.name}
            </H1>
            <Tooltip
              leftAlign
              placement="right"
              caption="Not the team you want to import these contacts into? No worries. Go to your team switcher to change your team and then try importing again."
            >
              <InfoIcon style={{ fill: primary, marginLeft: '0.5em' }} />
            </Tooltip>
          </Flex>
          <TeamContactSelect
            owner={this.props.owner}
            onSelect={this.props.onChangeOwner}
          />
        </div>
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

export default connect(
  mapStateToProps,
  {
    addCsvFile,
    updateWizardStep,
    showMessageModal,
    setCurrentStepValidation
  }
)(SelectFile)
