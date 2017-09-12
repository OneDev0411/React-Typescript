import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import Frame from './frame'

export default({
  task,
  incompleteFields,
  buttonCaption,
  loaded,
  saving,
  onSave,
  onClose,
  onFrameRef
}) => (
  <Modal
    show={true}
    backdrop="static"
    onHide={() => onClose()}
    dialogClassName="modal-deal-update-context"
  >
    <Modal.Body>
      <div className="wrapper">
        <div className="guide">
          <div className="title">
            Upload complete!
          </div>
          <div className="descr">
            Please enter any relevant information from the file that was just uploaded.
          </div>
        </div>

        <div className="context-data">
          <Frame
            task={task}
            frameRef={ref => onFrameRef(ref)}
          />

          <div className="cta">
            <Button
              className="deal-button"
              disabled={saving}
              onClick={() => onClose()}
            >
              Later
            </Button>

            <Button
              className="deal-button"
              disabled={saving}
              onClick={() => onSave()}
            >
              { saving ? 'Saving...' : 'Save' }
            </Button>
          </div>
        </div>
      </div>
    </Modal.Body>
  </Modal>
)
