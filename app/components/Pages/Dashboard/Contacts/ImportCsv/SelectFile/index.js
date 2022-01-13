import React from 'react'

import { Tooltip } from '@material-ui/core'
import { mdiInformationOutline } from '@mdi/js'
import cn from 'classnames'
import Dropzone from 'react-dropzone-rechat'
import { connect } from 'react-redux'
import { batchActions } from 'redux-batched-actions'
import Flex from 'styled-flex-component'

import { CONTACTS__IMPORT_CSV__STEP_UPLOAD_FILE } from '../../../../../../constants/contacts'
import { confirmation as showMessageModal } from '../../../../../../store_actions/confirmation'
import {
  addCsvFile,
  updateWizardStep,
  setCurrentStepValidation
} from '../../../../../../store_actions/contacts'
import Button from '../../../../../../views/components/Button/ActionButton'
import { Divider } from '../../../../../../views/components/Divider'
import { SvgIcon } from '../../../../../../views/components/SvgIcons/SvgIcon'
import { TeamContactSelect } from '../../../../../../views/components/TeamContact/TeamContactSelect'
import { H1 } from '../../../../../../views/components/Typography/headings'
import { primary } from '../../../../../../views/utils/colors'

class SelectFile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isDropzoneActive: false
    }

    this.activeTeam = props.activeTeam
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
      <div style={{ padding: '0 1.5rem' }}>
        <Flex center style={{ margin: '1.5em 0' }}>
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
                <Button
                  appearance="link"
                  onClick={() => {
                    this.dropzone.open()
                    this.dropzone.fileInputEl.click()
                  }}
                >
                  {file ? 'Change File' : 'Select a file'}
                </Button>
              </div>
            </div>
          </Dropzone>
        </Flex>

        <div style={{ margin: '0 auto 4em', maxWidth: '20rem' }}>
          <p style={{ fontSize: '0.875rem', textAlign: 'center' }}>
            Importing To
          </p>
          <Flex center style={{ marginBottom: '1em' }}>
            <H1 style={{ fontSize: '1.125rem' }}>
              {this.activeTeam &&
                this.activeTeam.brand &&
                this.activeTeam.brand.name}
            </H1>
            <Tooltip
              placement="right"
              // eslint-disable-next-line max-len
              title="Not the team you want to import these contacts into? No worries. Go to your team switcher to change your team and then try importing again."
            >
              <SvgIcon
                path={mdiInformationOutline}
                color={primary}
                leftMargined
              />
            </Tooltip>
          </Flex>
          <Divider width="100%" height="1px" margin="0 0 1rem" />
          <p style={{ fontSize: '0.875rem' }}>Contact Owner</p>
          <TeamContactSelect
            upsideDown
            fullWidth
            user={this.props.user}
            owner={this.props.owner}
            onSelect={this.props.onChangeOwner}
          />
        </div>
      </div>
    )
  }
}

function mapStateToProps({ user, contacts, activeTeam = null }) {
  const { importCsv } = contacts
  const { file } = importCsv

  return {
    activeTeam,
    file,
    user
  }
}

export default connect(mapStateToProps, {
  addCsvFile,
  updateWizardStep,
  showMessageModal,
  setCurrentStepValidation
})(SelectFile)
