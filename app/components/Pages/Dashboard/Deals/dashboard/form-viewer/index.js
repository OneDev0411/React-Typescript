import React from 'react'
import { connect } from 'react-redux'
import { Row, Col, Modal, Button } from 'react-bootstrap'
import DealInfo from '../deal-info'
import Comments from '../comments'
import CommentInput from '../comments/input'
import PdfViewer from '../../../../../Partials/Pdf/Viewer'

const COMMENTS_WIDTH = 3
const FACTSHEET_WIDTH = 3
const PDF_WIDTH = 6

class FormViewer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showFactsheet: false,
      showComments: false
    }
  }

  toggleComments() {
    this.setState({
      showComments: !this.state.showComments
    })
  }

  toggleFactsheet() {
    this.setState({
      showFactsheet: !this.state.showFactsheet
    })
  }

  render() {
    const { showFactsheet, showComments } = this.state
    const { deal, task, form, isActive, onClose} = this.props
    const { name, url } = form

    let pdfWidth = PDF_WIDTH

    if (showFactsheet === false) {
      pdfWidth += FACTSHEET_WIDTH
    }

    if (showComments === false) {
      pdfWidth += COMMENTS_WIDTH
    }

    return (
      <Modal
        className="deal-form-viewer-modal"
        show={isActive}
        onHide={onClose}
      >
        <Modal.Header>
          <Button
            onClick={onClose}
            className="close-btn"
          >
            X
          </Button>

          <span className="title">
            { name }
          </span>

          <div className="cta">
            <Button
              className="deal-button"
              onClick={() => this.toggleComments()}
            >
              <i className="fa fa-comment-o" />
              Comments
            </Button>

            <Button
              className="deal-button"
              onClick={() => this.toggleFactsheet()}
            >
              <i className="fa fa-comment-o" />
              Deal Facts
            </Button>
          </div>

        </Modal.Header>

        <Modal.Body>
          <Row className="wrapper">
            <Col
              className="factsheet"
              md={FACTSHEET_WIDTH}
              lg={FACTSHEET_WIDTH}
              style={{ display: showFactsheet ? 'block' : 'none '}}
            >
              <DealInfo
                deal={deal}
                noBackButton
              />
            </Col>

            <Col
              md={pdfWidth}
              lg={pdfWidth}
              className="pdf-viewer"
            >
              <PdfViewer
                uri={url}
                scale="auto"
              />
            </Col>

            <Col
              className="comments"
              md={COMMENTS_WIDTH}
              lg={COMMENTS_WIDTH}
              style={{ display: showComments ? 'block' : 'none '}}
            >
              <Comments
                task={task}
              />

              <CommentInput
                noCloseButton
                task={task}
              />
            </Col>
          </Row>

        </Modal.Body>
      </Modal>
    )
  }
}

export default FormViewer
