import React from 'react'
import { connect } from 'react-redux'
import { Row, Col, Modal, Button } from 'react-bootstrap'
import DealInfo from '../deal-info'
import Comments from '../comments'
import CommentInput from '../comments/input'
import PdfViewer from '../../../../../Partials/Pdf/Viewer'
import { setFormViewer } from '../../../../../../store_actions/deals/forms'

class FormViewer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showFactsheet: props.isBackOffice,
      showComments: props.isBackOffice
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

  onClose() {
    const { setFormViewer } = this.props
    setFormViewer(null)
  }

  render() {
    const { showFactsheet, showComments } = this.state
    const { deal, formViewer } = this.props
    const { task, title, file } = formViewer

    if (!task) {
      return false
    }

    const { name, type, url, downloadUrl } = file

    const COMMENTS_WIDTH = showComments ? '300px' : '0px'
    const FACTSHEET_WIDTH = showFactsheet ? '300px' : '0px'
    const PDF_WIDTH = `calc(100% - ${COMMENTS_WIDTH} - ${FACTSHEET_WIDTH})`

    if (['pdf', 'image'].indexOf(type) === -1) {
      return null
    }

    return (
      <Modal
        className="deal-form-viewer-modal"
        show={task !== null}
        onHide={() => this.onClose()}
      >
        <Modal.Header>
          <Button
            onClick={() => this.onClose()}
            className="close-btn"
          >
            X
          </Button>

          <span className="title">
            { title || name }
          </span>

          <div className="cta">
            <Button
              className="deal-button"
              onClick={() => this.toggleFactsheet()}
            >
              <img src="/static/images/deals/digital-form.svg" />
              Deal Facts
            </Button>

            <Button
              className="deal-button comments"
              onClick={() => this.toggleComments()}
            >
              <img src="/static/images/deals/comments.svg" />
              Comments
            </Button>
          </div>

        </Modal.Header>

        <Modal.Body>
          <div
            className={`fw-wrapper ${showFactsheet ? 'show-factsheet' : ''} ${showComments ? 'show-comments' : ''}`}
          >
            <div
              className="factsheet"
              style={{
                display: showFactsheet ? 'block' : 'none',
                minWidth: FACTSHEET_WIDTH,
                maxWidth: FACTSHEET_WIDTH
              }}
            >
              <DealInfo
                deal={deal}
                showBackButton={false}
              />
            </div>

            <div
              style={{
                minWidth: PDF_WIDTH,
                maxWidth: PDF_WIDTH
              }}
              className="file-viewer"
            >
              {
                type === 'pdf' &&
                <PdfViewer
                  uri={url}
                  downloadUrl={downloadUrl}
                  defaultContainerHeight="85vh"
                />
              }

              {
                type === 'image' &&
                <img
                  className="image"
                  src={url}
                  alt={name}
                />
              }
            </div>

            <div
              className="comments"
              style={{
                display: showComments ? 'block' : 'none',
                minWidth: COMMENTS_WIDTH,
                maxWidth: COMMENTS_WIDTH
              }}
            >
              <Comments
                task={task}
              />

              <CommentInput
                task={task}
              />
            </div>
          </div>

        </Modal.Body>
      </Modal>
    )
  }
}

export default connect(({ deals }) => ({
  formViewer: deals.formViewer,
  isBackOffice: deals.backoffice
}), { setFormViewer })(FormViewer)
