import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { connect } from 'react-redux'
import cn from 'classnames'
import ReactTooltip from 'react-tooltip'
import { resetUploadFiles, setUploadAttributes, displaySplitter,
  addAttachment, changeNeedsAttention, resetSplitter } from '../../../../../../../store_actions/deals'
import ChatModel from '../../../../../../../models/Chatroom'
import TasksDropDown from '../tasks-dropdown'
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

  onClickNotifyAdmin(fileId, file) {
    this.props.setUploadAttributes(fileId, {
      notifyOffice: file.properties.notifyOffice ? false : true
    })
  }

  onSelectTask(fileId, taskId) {
    this.props.setUploadAttributes(fileId, { taskId })
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

    // set status
    this.props.setUploadAttributes(id, { status: STATUS_UPLOADING})

    // upload file
    const file = await this.uploadFile(task.room.id, fileObject, properties.fileTitle)

    if (!file) {
      return false
    }

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
      return <i className="fa fa-check" />
    }

    return 'Upload'
  }

  render() {
    const { splitter, upload } = this.props
    const filesCount = _.size(upload.files)
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
          <ReactTooltip
            effect="solid"
          />

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
                          fileId={id}
                          file={file}
                          canEditName={file.properties.editNameEnabled === true}
                        />
                      </div>

                      <div className="file-task">
                        <TasksDropDown
                          onSelectTask={(taskId) => this.onSelectTask(id, taskId)}
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
                          onClick={() => this.onClickNotifyAdmin(id, file)}
                        />
                      }
                    </div>
                  </div>
                )
              })
            }
          </div>
        </Modal.Body>

        <Modal.Footer>
          <img
            src="/static/images/deals/question.png"
            className="help"
            data-tip="Create new documents and save them to tasks"
          />

          <Button
            bsStyle="primary"
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
  resetUploadFiles,
  resetSplitter,
  setUploadAttributes,
  displaySplitter,
  addAttachment,
  changeNeedsAttention
})(UploadModal)
