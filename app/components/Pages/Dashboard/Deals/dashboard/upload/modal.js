import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { connect } from 'react-redux'
import { clearUploadFiles } from '../../../../../../store_actions/deals'
import TasksDropDown from './tasks-dropdown'

class UploadModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  closeModal() {
    this.props.clearUploadFiles()
  }

  render() {
    const { upload } = this.props

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

        <Modal.Body>
          {
            upload.files.map((file, id) =>
              <div className="upload-row" key={id}>
                <div className="file-name">
                  <img src="/static/images/deals/document.png" />
                  { file.name }
                </div>

                <div className="file-task">
                  <TasksDropDown />
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
            )
          }
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
