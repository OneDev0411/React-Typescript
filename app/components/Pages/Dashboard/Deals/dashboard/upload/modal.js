import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { connect } from 'react-redux'
import { clearUploadFiles } from '../../../../../../store_actions/deals'
import TasksDropDown from './tasks-dropdown'
import Checkbox from '../../components/radio'

class UploadModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

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

  render() {
    const { upload } = this.props
    const filesCount = upload.files.length

    return (
      <Modal
        dialogClassName="modal-deal-upload-files"
        show={upload.files.length > 0}
        onHide={() => this.closeModal()}
        backdrop="static"
      >
        <Modal.Header closeButton>
          { upload.files.length } Documents
        </Modal.Header>

        <Modal.Body
          style={this.getModalStyle(filesCount)}
        >
          <div className="uploads-container">
            {
              upload.files.map((file, key) =>
                <div key={key}>
                  <div className="upload-row">
                    <div className="file-name">
                      <img src="/static/images/deals/document.png" />
                      { file.name }
                    </div>

                    <div className="file-task">
                      <TasksDropDown
                        shouldDropUp={filesCount > 4 && key + 2 >= filesCount}
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
                      selected={true}
                      title="Notify Office"
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

export default connect(mapStateToProps, { clearUploadFiles })(UploadModal)
