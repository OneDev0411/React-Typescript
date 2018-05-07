import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { connect } from 'react-redux'
import cn from 'classnames'
import _ from 'underscore'
import { addNotification as notify } from 'reapop'
import {
  uploadTaskFile,
  uploadStashFile,
  resetUploadFiles,
  setUploadAttributes,
  displaySplitter,
  changeNeedsAttention,
  resetSplitter
} from '../../../../../../../store_actions/deals'
import TasksDropDown from '../../../components/tasks-dropdown'
import ToolTip from '../../../../../../../views/components/tooltip/index'
import Checkbox from '../../../../../../../views/components/radio'
import FileName from './file-name'

const STATUS_UPLOADING = 'uploading'
const STATUS_UPLOADED = 'uploaded'

class UploadModal extends React.Component {
  constructor(props) {
    super(props)
  }

  closeModal() {
    this.props.resetUploadFiles()
    this.props.resetSplitter()
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
    const { selectedTaskInDeal, tasks } = this.props

    // tasks-dropdown search filter has cleared by user
    if (file.properties.taskId === null) {
      return null
    }

    if (file.properties.taskId) {
      // is not undefined
      return tasks[file.properties.taskId]
    } else if (selectedTaskInDeal) {
      return selectedTaskInDeal
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
    const filename = properties.fileTitle || fileObject.name

    // set status
    setUploadAttributes(id, { status: STATUS_UPLOADING })

    // upload file
    const file = task
      ? await uploadTaskFile(user, task, fileObject, filename)
      : await uploadStashFile(deal.id, fileObject, filename)

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
    setUploadAttributes(id, { status: STATUS_UPLOADED })

    if (task && properties.notifyOffice === true && !isBackupContract) {
      changeNeedsAttention(task.deal, task.id, true)
    }
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

  getPdfFiles() {
    const { upload } = this.props

    return _.filter(
      upload.files,
      file =>
        file.fileObject.type === 'application/pdf' &&
        file.properties.status !== STATUS_UPLOADED
    )
  }

  showSplitter() {
    const { displaySplitter } = this.props

    const files = this.getPdfFiles().map(item => ({
      id: item.id,
      file: item.fileObject,
      properties: { name: item.fileObject.name, ...item.properties }
    }))

    displaySplitter(files)
  }

  render() {
    const { deal, splitter, upload } = this.props
    const filesCount = _.size(upload.files)

    // get list of pdfs aren't uploaded yet
    const pdfsList = this.getPdfFiles()

    let fileCounter = 0

    return (
      <Modal
        dialogClassName="modal-deal-upload-files"
        show={filesCount > 0 && _.size(splitter.files) === 0}
        onHide={() => this.closeModal()}
        backdrop="static"
      >
        <Modal.Header closeButton>{filesCount} Documents</Modal.Header>

        <Modal.Body style={this.getModalStyle(filesCount)}>
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
                        onSelectTask={taskId => this.onSelectTask(file, taskId)}
                        selectedTask={selectedTask}
                        shouldDropUp={
                          filesCount > 4 && fileCounter + 2 >= filesCount
                        }
                      />
                    </div>

                    <div className="file-cta">
                      <Button
                        bsStyle="primary"
                        className={cn({
                          disabled: isUploading || _.isUndefined(selectedTask),
                          uploaded: isUploaded
                        })}
                        disabled={isUploading || _.isUndefined(selectedTask)}
                        onClick={() => this.upload(file, selectedTask)}
                      >
                        {this.getButtonCaption(file)}
                      </Button>
                    </div>
                  </div>
                  <div className="notify-admin">
                    {!isBackupContract &&
                      !isUploading &&
                      !isUploaded && (
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
        </Modal.Body>

        <Modal.Footer>
          <ToolTip caption="Create new documents and save them to tasks">
            <img
              src="/static/images/deals/question.png"
              className="help"
              alt=""
            />
          </ToolTip>

          <Button
            bsStyle="primary"
            className={cn('btn-split', { disabled: pdfsList.length === 0 })}
            disabled={pdfsList.length === 0}
            onClick={() => this.showSplitter()}
          >
            Split PDFs
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

function mapStateToProps({ deals, user }) {
  return {
    user,
    checklists: deals.checklists,
    selectedTaskInDeal: deals.selectedTask,
    tasks: deals.tasks,
    upload: deals.upload,
    splitter: deals.splitter
  }
}

export default connect(mapStateToProps, {
  notify,
  uploadTaskFile,
  uploadStashFile,
  resetUploadFiles,
  resetSplitter,
  displaySplitter,
  setUploadAttributes,
  changeNeedsAttention
})(UploadModal)
