import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { connect } from 'react-redux'
import { clearUploadFiles, setUploadAttributes } from '../../../../../../store_actions/deals'
import ChatModel from '../../../../../../models/Chatroom'
import TasksDropDown from './tasks-dropdown'
import Checkbox from '../../components/radio'

class UploadModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

    }
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
    console.log('>>>>>>', file)
    this.props.setUploadAttributes(fileId, {
      notifyAdmin: file.notifyAdmin ? false : true
    })
  }

  onSelectTask(fileId, taskId) {
    console.log(fileId, taskId)
    this.props.setUploadAttributes(fileId, { taskId })
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
              _.map(upload.files, (file, id) =>
                <div key={id}>
                  <div className="upload-row">
                    <div className="file-name">
                      <img src="/static/images/deals/document.png" />
                      { file.name }
                    </div>

                    <div className="file-task">
                      <TasksDropDown
                        onSelectTask={(taskId) => this.onSelectTask(id, taskId)}
                        selectedTask={file.taskId}
                        shouldDropUp={filesCount > 4 && id + 2 >= filesCount}
                      />
                    </div>

                    <div className="file-cta">
                      <Button
                        bsStyle="primary"
                        onClick={() => null}
                      >
                        Upload
                      </Button>
                    </div>
                  </div>
                  <div className="notify-admin">
                    <Checkbox
                      square
                      selected={file.notifyAdmin || false}
                      title="Notify Office"
                      onClick={() => this.onClickNotifyAdmin(id, file)}
                    />
                  </div>
                </div>
              )
            }
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            bsStyle="primary"
            onClick={() => null}
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
    upload: deals.upload
  }
}

export default connect(mapStateToProps, {
  clearUploadFiles, setUploadAttributes
})(UploadModal)
