import React from 'react'
import { Row, Col, Modal, Button } from 'react-bootstrap'
import PdfViewer from '../../../../Partials/Pdf/Viewer'
import Viewer from './viewer'
import WhoSigned from './who-signed'

export default ({
  deal,
  onClose,
  editForm,
  envelope,
  task,
  file
}) => {
  const { name, type, url, downloadUrl } = file

  return (
    <Modal
      className="deal-form-viewer-modal"
      show
      onHide={onClose}
    >
      <Modal.Header>
        <span className="title">
          { name }
        </span>

        <div className="cta">
          <Button
            onClick={onClose}
            className="close-btn"
          >
            X
          </Button>
        </div>
      </Modal.Header>

      <Modal.Body>
        <div className="fw-wrapper show-envelopes">
          <Viewer
            width="calc(100% - 375px)"
            file={file}
          />

          <div
            className="envelopes"
            style={{ width: '375px' }}
          >
            <WhoSigned
              deal={deal}
              envelope={envelope}
              onClose={onClose}
            />
          </div>
        </div>

      </Modal.Body>
    </Modal>
  )
}
