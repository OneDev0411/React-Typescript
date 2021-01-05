// todo: the entire file should re-implement

import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import cn from 'classnames'
import _ from 'underscore'

import { Button, Tooltip } from '@material-ui/core'

import { addNotification as notify } from 'components/notification'

import { Modal, ModalContent, ModalHeader, ModalFooter } from 'components/Modal'

import {
  uploadTaskFile,
  uploadStashFile,
  resetUploadFiles,
  setUploadAttributes,
  changeNeedsAttention,
  setExpandChecklist
} from 'actions/deals'

import Checkbox from 'components/CheckmarkButton'

import Deal from 'models/Deal'

import UploadProgress from './upload-progress'

import TasksDropDown from '../../components/TasksDropdown'
import FileName from './file-name'
import PdfSplitter from '../../PdfSplitter'

const STATUS_UPLOADING = 'uploading'
const STATUS_UPLOADED = 'uploaded'

class UploadModal extends React.Component {
  state = {
    uploadProgress: {},
    splitFiles: []
  }

  closeModal() {
    this.props.resetUploadFiles()
  }

  getModalStyle(filesCount) {
    if (filesCount <= 5) {
      return {}
    }

    return {
      maxHeight: '400px',
      overflow: 'auto'
    }
  }

  onClickNotifyAdmin(file) {
    this.props.setUploadAttributes(file.id, {
      notifyOffice: !file.properties.notifyOffice
    })
  }

  onSelectTask(file, taskId) {
    this.props.setUploadAttributes(file.id, { taskId })
  }

  getSelectedTask(file) {
    const { selectedTask, tasks } = this.props

    // tasks-dropdown search filter has cleared by user
    if (file.properties.taskId === null) {
      return null
    }

    if (file.properties.taskId) {
      // is not undefined
      return tasks[file.properties.taskId]
    }

    if (selectedTask) {
      return selectedTask
    }

    return undefined
  }

  async upload({ id, fileObject, properties }, task) {
    const {
      user,
      deal,
      uploadTaskFile,
      uploadStashFile,
      setUploadAttributes,
      changeNeedsAttention,
      notify
    } = this.props

    if (properties.status === STATUS_UPLOADED) {
      return false
    }

    // check task is inside a backup contract
    const isBackupContract = this.isBackupContract(task)

    // get filename
    const filename = this.getFileName({ fileObject, properties })

    // set status
    setUploadAttributes(id, { status: STATUS_UPLOADING })

    // check the file is allowed to upload or not
    const isFileAllowed = Deal.upload
      .getAcceptedDocuments()
      .split(',')
      .some(extname => this.getFileExtension(fileObject.name) === extname)

    if (!isFileAllowed) {
      return notify({
        message: 'This file is not allowed to upload in your documents',
        status: 'error'
      })
    }

    const progressFn = this.uploadProgress.bind(
      this,
      this.getFileUniqueId(fileObject),
      filename || fileObject.name
    )

    // upload file
    const file = task
      ? await uploadTaskFile(user, task, fileObject, filename, progressFn)
      : await uploadStashFile(deal.id, fileObject, filename, progressFn)

    if (!file) {
      setUploadAttributes(id, { status: null })

      notify({
        message: `Couldn't upload "${filename}". try again.`,
        status: 'error'
      })

      return false
    }

    notify({
      message: `"${filename}" uploaded.`,
      status: 'success'
    })

    if (task && properties.notifyOffice === true && !isBackupContract) {
      changeNeedsAttention(task.deal, task.id, true)
    }

    // set status
    try {
      setUploadAttributes(id, { status: STATUS_UPLOADED, response: file })
    } catch (e) {
      /* nothing */
    }

    // open checklist if is close
    if (task) {
      this.props.setExpandChecklist(task.checklist, true)
    }
  }

  getFileName({ fileObject, properties }) {
    // get file extension name
    const extension = this.getFileExtension(fileObject.name)

    // get file title
    const filename = properties.fileTitle || fileObject.name

    return filename.endsWith(extension) ? filename : `${filename}${extension}`
  }

  getFileExtension(filename) {
    return `.${filename.split('.').pop().toLowerCase()}`
  }

  getButtonCaption(file) {
    const { status } = file.properties

    if (status === STATUS_UPLOADING) {
      return 'Uploading ...'
    }

    if (status === STATUS_UPLOADED) {
      return 'Uploaded'
    }

    return 'Upload'
  }

  isBackupContract(task) {
    const { checklists } = this.props

    if (!task) {
      return false
    }

    return checklists[task.checklist].is_deactivated
  }

  get isSplitButtonActive() {
    const pdfFiles = _.filter(
      this.props.upload.files,
      file => file.fileObject.type === 'application/pdf'
    )

    if (pdfFiles.length === 0) {
      return false
    }

    return pdfFiles.every(file => file.properties.status === STATUS_UPLOADED)
  }

  getFileUniqueId(fileObject) {
    return (
      fileObject.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() +
      fileObject.lastModified
    )
  }

  uploadProgress(id, filename, e) {
    this.setState(state => ({
      uploadProgress: {
        ...state.uploadProgress,
        [id]: {
          filename,
          percent: e.percent
        }
      }
    }))
  }

  handleOpenSplitter = () => {
    const files = _.filter(
      this.props.upload.files,
      file => file.fileObject.type === 'application/pdf'
    ).map(file => file.properties.response)

    this.setState({
      splitFiles: files
    })

    this.closeModal()
  }

  handleCloseSplitter = () => {
    this.setState({
      splitFiles: []
    })
  }

  render() {
    const { deal, upload } = this.props

    const filesCount = _.size(upload.files)

    let fileCounter = 0

    return (
      <React.Fragment>
        <Modal
          className="modal-deal-upload-files"
          isOpen={filesCount > 0}
          autoHeight
          offOverflow
          onRequestClose={() => this.closeModal()}
        >
          <ModalHeader
            closeHandler={() => this.closeModal()}
            className="modal-header"
            title={`${filesCount} Documents`}
          />

          <ModalContent style={this.getModalStyle(filesCount)}>
            <div className="uploads-container">
              {_.map(upload.files, (file, id) => {
                const selectedTask = this.getSelectedTask(file)
                const isBackupContract = this.isBackupContract(selectedTask)
                const isUploading = file.properties.status === STATUS_UPLOADING
                const isUploaded = file.properties.status === STATUS_UPLOADED

                fileCounter += 1

                return (
                  <div key={id}>
                    <div className="upload-row">
                      {!isUploading && !isUploaded && (
                        <Fragment>
                          <div className="file-name">
                            <FileName
                              file={file}
                              canEditName={file.properties.editNameEnabled}
                            />
                          </div>

                          <div className="file-task">
                            <TasksDropDown
                              searchable
                              showStashOption
                              deal={deal}
                              onSelectTask={taskId =>
                                this.onSelectTask(file, taskId)
                              }
                              selectedTask={selectedTask}
                              shouldDropUp={
                                filesCount > 4 && fileCounter + 2 >= filesCount
                              }
                            />
                          </div>

                          <div className="file-cta">
                            <Button
                              color="secondary"
                              variant="contained"
                              className={cn({
                                uploaded: isUploaded
                              })}
                              disabled={
                                isUploading || _.isUndefined(selectedTask)
                              }
                              onClick={() => this.upload(file, selectedTask)}
                            >
                              {this.getButtonCaption(file)}
                            </Button>
                          </div>
                        </Fragment>
                      )}

                      {(isUploading || isUploaded) && (
                        <UploadProgress
                          isUploadFinished={isUploaded}
                          progress={
                            this.state.uploadProgress[
                              this.getFileUniqueId(file.fileObject)
                            ]
                          }
                        />
                      )}
                    </div>
                    <div className="notify-admin">
                      {!isBackupContract && !isUploading && !isUploaded && (
                        <Checkbox
                          square
                          selected={file.properties.notifyOffice || false}
                          title="Notify Office"
                          onClick={() => this.onClickNotifyAdmin(file)}
                        />
                      )}

                      {isUploaded &&
                        file.properties.notifyOffice &&
                        !isBackupContract && (
                          <span className="notified">Office Notified</span>
                        )}
                    </div>
                  </div>
                )
              })}
            </div>
          </ModalContent>

          <ModalFooter className="modal-footer">
            <Tooltip
              title={
                this.isSplitButtonActive
                  ? 'You can split files as soon as upload them'
                  : ''
              }
            >
              <Button
                variant="contained"
                color="secondary"
                disabled={!this.isSplitButtonActive}
                style={{ marginRight: '1rem' }}
                onClick={this.handleOpenSplitter}
              >
                Split PDF
              </Button>
            </Tooltip>

            <Tooltip title="Create new documents and save them to tasks">
              <div className="help">?</div>
            </Tooltip>
          </ModalFooter>
        </Modal>

        {this.state.splitFiles.length > 0 && (
          <PdfSplitter
            files={this.state.splitFiles}
            deal={this.props.deal}
            onClose={this.handleCloseSplitter}
          />
        )}
      </React.Fragment>
    )
  }
}

function mapStateToProps({ deals, user }) {
  return {
    user,
    checklists: deals.checklists,
    selectedTask: deals.properties.selectedTask,
    tasks: deals.tasks,
    upload: deals.upload
  }
}

export default connect(mapStateToProps, {
  notify,
  uploadTaskFile,
  uploadStashFile,
  resetUploadFiles,
  setUploadAttributes,
  setExpandChecklist,
  changeNeedsAttention
})(UploadModal)
