// todo: the entire file should re-implement

import React, { Fragment } from 'react'

import { Box, Button, Tooltip } from '@material-ui/core'
import cn from 'classnames'
import { connect } from 'react-redux'
import _ from 'underscore'

import {
  uploadTaskFile,
  uploadStashFile,
  resetUploadFiles,
  setUploadAttributes,
  setExpandChecklist,
  changeNeedsAttention
} from 'actions/deals'
import { Modal, ModalContent, ModalHeader, ModalFooter } from 'components/Modal'
import { addNotification as notify } from 'components/notification'
import Deal from 'models/Deal'

import TasksDropDown from '../../components/TasksDropdown'
import { NotifyOfficeConfirmation } from '../../Create/components/NotifyOfficeConfirmation'
import PdfSplitter from '../../PdfSplitter'

import FileName from './file-name'
import UploadProgress from './upload-progress'

const STATUS_UPLOADING = 'uploading'
const STATUS_UPLOADED = 'uploaded'

class UploadModal extends React.Component {
  state = {
    uploadProgress: {},
    splitFiles: [],
    isNotifyOfficeDialogOpen: false
  }

  closeModal() {
    this.props.resetUploadFiles()

    this.setState({
      isNotifyOfficeDialogOpen: false
    })
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
      notify
    } = this.props

    if (properties.status === STATUS_UPLOADED) {
      return false
    }

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
      return 'Uploading...'
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

  get isFinished() {
    const files = Object.values(this.props.upload.files)

    return (
      files.length > 0 &&
      files.every(file => file.properties.status === STATUS_UPLOADED)
    )
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

  get TaskIds() {
    return Object.values(this.props.upload.files)
      .map(file => file.properties.taskId)
      .filter(taskId => !!taskId)
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

  handleNext = () => {
    this.setState({
      isNotifyOfficeDialogOpen: true
    })
  }

  skipNotifyOffice = () => {
    this.closeModal()
  }

  notifyOffice = () => {
    this.TaskIds.forEach(taskId =>
      this.props.changeNeedsAttention(this.props.deal.id, taskId, true)
    )

    this.closeModal()
  }

  render() {
    const { deal, upload } = this.props

    const taskIds = this.TaskIds
    const filesCount = _.size(upload.files)

    let fileCounter = 0

    return (
      <>
        <Modal
          className="modal-deal-upload-files"
          isOpen={filesCount > 0 && !this.state.isNotifyOfficeDialogOpen}
          autoHeight
          offOverflow
        >
          <ModalHeader
            closeHandler={
              this.isFinished && taskIds.length > 0
                ? undefined
                : () => this.closeModal()
            }
            className="modal-header"
            title={`${filesCount} Documents`}
          />

          <ModalContent style={this.getModalStyle(filesCount)}>
            <div className="uploads-container">
              {_.map(upload.files, (file, id) => {
                const selectedTask = this.getSelectedTask(file)
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
                  </div>
                )
              })}
            </div>
          </ModalContent>

          <ModalFooter className="modal-footer">
            <Box
              width="100%"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mx={1}
            >
              <Box display="flex" alignItems="center">
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
              </Box>

              <div>
                {taskIds.length > 0 && (
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={this.isFinished === false}
                    onClick={this.handleNext}
                  >
                    Next
                  </Button>
                )}
              </div>
            </Box>
          </ModalFooter>
        </Modal>

        <NotifyOfficeConfirmation
          title="Should we ask office to review the uploaded files?"
          deal={this.props.deal}
          isOpen={this.state.isNotifyOfficeDialogOpen}
          onCancel={this.skipNotifyOffice}
          onConfirm={this.notifyOffice}
        />

        {this.state.splitFiles.length > 0 && (
          <PdfSplitter
            files={this.state.splitFiles}
            deal={this.props.deal}
            onClose={this.handleCloseSplitter}
          />
        )}
      </>
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
