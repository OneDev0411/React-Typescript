import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { connect } from 'react-redux'
import cn from 'classnames'
import { clearUploadFiles, setUploadAttributes,
  displaySplitter } from '../../../../../../../store_actions/deals'
import ChatModel from '../../../../../../../models/Chatroom'
import TasksDropDown from '../tasks-dropdown'
import Checkbox from '../../../components/radio'
import FileName from './file-name'

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
    this.props.clearUploadFiles()
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

  render() {
    const { upload } = this.props
    const filesCount = _.size(upload.files)

    return (
      <Modal
        dialogClassName="modal-deal-upload-files"
        show={filesCount > 0}
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
                          shouldDropUp={filesCount > 4 && id + 2 >= filesCount}
                        />
                      </div>

                      <div className="file-cta">
                        <Button
                          bsStyle="primary"
                          className={cn({ disabled: selectedTask === null })}
                          disabled={selectedTask === null}
                          onClick={() => null}
                        >
                          Upload
                        </Button>
                      </div>
                    </div>
                    <div className="notify-admin">
                      <Checkbox
                        square
                        selected={file.properties.notifyOffice || false}
                        title="Notify Office"
                        onClick={() => this.onClickNotifyAdmin(id, file)}
                      />
                    </div>
                  </div>
                )
              })
            }
          </div>
        </Modal.Body>

        <Modal.Footer>
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
    upload: deals.upload
  }
}

export default connect(mapStateToProps, {
  clearUploadFiles, setUploadAttributes, displaySplitter
})(UploadModal)
