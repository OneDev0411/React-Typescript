import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { connect } from 'react-redux'
import cn from 'classnames'
import { addNotification as notify } from 'reapop'
import { resetUploadFiles, setUploadAttributes, displaySplitter,
  addAttachment, changeNeedsAttention, resetSplitter } from '../../../../../../../store_actions/deals'
import ChatModel from '../../../../../../../models/Chatroom'
import TasksDropDown from '../tasks-dropdown'
import ToolTip from '../../../components/tooltip'
import Checkbox from '../../../components/radio'
import FileName from './file-name'

const STATUS_UPLOADING = 'uploading'
const STATUS_UPLOADED = 'uploaded'

class UploadModal extends React.Component {
  constructor(props) {
    super(props)
  }

  /**
   * upload a file to room
   */
  async uploadFile(roomId, file) {
    try {
      const response = await ChatModel.uploadAttachment(roomId, file)
      return response.body.data
    } catch(e) {
      return null
    }
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
    const { upload, tasks } = this.props

    if (file.properties.taskId) {
      return tasks[file.properties.taskId]
    } else if (upload.task) {
      return upload.task
    }

    return null
  }

  async upload({ id, fileObject, properties }, task) {
    if (properties.status === STATUS_UPLOADED) {
      return false
    }

    // get filename
    const filename = properties.fileTitle || fileObject.name

    // set status
    this.props.setUploadAttributes(id, { status: STATUS_UPLOADING})

    // upload file
    const file = await this.uploadFile(task.room.id, fileObject, filename)

    if (!file) {
      this.props.setUploadAttributes(id, { status: null })

      this.props.notify({
        message: `Couldn't upload "${filename}". try again.`,
        status: 'error'
      })

      return false
    }

    this.props.notify({
      message: `"${filename}" uploaded.`,
      status: 'success'
    })

    // set status
    this.props.setUploadAttributes(id, { status: STATUS_UPLOADED })

    // add files to attachments list
    this.props.addAttachment(task.deal, task.checklist, task.id, file)

    if (properties.notifyOffice === true) {
      this.props.changeNeedsAttention(task.id, true)
    }
  }

  /**
   * upload a file to room
   */
  async uploadFile(roomId, file, fileName) {
    try {
      const response = await ChatModel.uploadAttachment(roomId, file, fileName)
      return response.body.data
    } catch(e) {
      return null
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

  render() {
    const { splitter, upload } = this.props
    const filesCount = _.size(upload.files)

    // get list of pdfs aren't uploaded yet
    const pdfsList = _.filter(upload.files, file =>
      file.fileObject.type === 'application/pdf' && file.properties.status !== STATUS_UPLOADED)

    let fileCounter = 0

    return (
      <Modal
        dialogClassName="modal-deal-upload-files"
        show={filesCount > 0 && !splitter.display}
        onHide={() => this.closeModal()}
        backdrop="static"
      >
        <Modal.Header closeButton>
          { filesCount } Documents
        </Modal.Header>

        <Modal.Body
          style={this.getModalStyle(filesCount)}
        >
          <div className="uploads-container">
            {
              _.map(upload.files, (file, id) => {
                const selectedTask = this.getSelectedTask(file)
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
                          onSelectTask={(taskId) => this.onSelectTask(file, taskId)}
                          selectedTask={selectedTask}
                          shouldDropUp={filesCount > 4 && fileCounter + 2 >= filesCount}
                        />
                      </div>

                      <div className="file-cta">
                        <Button
                          bsStyle="primary"
                          className={cn({
                            disabled: isUploading || !selectedTask,
                            uploaded: isUploaded
                          })}
                          disabled={isUploading || !selectedTask}
                          onClick={() => this.upload(file, selectedTask)}
                        >
                          {this.getButtonCaption(file)}
                        </Button>
                      </div>
                    </div>
                    <div className="notify-admin">
                      {
                        (!isUploading && !isUploaded) &&
                        <Checkbox
                          square
                          selected={file.properties.notifyOffice || false}
                          title="Notify Office"
                          onClick={() => this.onClickNotifyAdmin(file)}
                        />
                      }

                      {
                        (isUploaded && file.properties.notifyOffice) &&
                        <span className="notified">
                          Office Notified
                        </span>
                      }
                    </div>
                  </div>
                )
              })
            }
          </div>
        </Modal.Body>

        <Modal.Footer>
          <ToolTip caption="Create new documents and save them to tasks">
            <img
              src="/static/images/deals/question.png"
              className="help"
            />
          </ToolTip>

          <Button
            bsStyle="primary"
            className={cn('btn-split', { disabled: pdfsList.length === 0 })}
            disabled={pdfsList.length === 0}
            onClick={() => this.props.displaySplitter(true)}
          >
            Split PDFs
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

function mapStateToProps({ deals }) {
  return {
    tasks: deals.tasks,
    upload: deals.upload,
    splitter: deals.splitter
  }
}

export default connect(mapStateToProps, {
  notify,
  resetUploadFiles,
  resetSplitter,
  setUploadAttributes,
  displaySplitter,
  addAttachment,
  changeNeedsAttention
})(UploadModal)
