import React from 'react'
import { connect } from 'react-redux'
import { Row, Col, Modal, Button } from 'react-bootstrap'
import { browserHistory } from 'react-router'
import DealInfo from '../dashboard/deal-info'
import Comments from '../dashboard/comments'
import CommentInput from '../dashboard/comments/input'
import PdfViewer from '../../../../Partials/Pdf/Viewer'
import extractDocumentOfTask from '../utils/extract-document-of-task'
import config from '../../../../../../config/public'

class FormViewer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showFactsheet: props.isBackOffice,
      showComments: props.isBackOffice,
      file: this.getFile()
    }
  }

  getFile() {
    const { params } = this.props
    const { type } = params

    switch (type) {
      case 'attachment':
        return this.getAttachmentFile()
      case 'envelope':
        return this.getEnvelopeFile()
      default:
        return this.getDigitalForm()
    }
  }

  getAttachmentFile() {
    const { tasks, params } = this.props
    const { taskId, objectId } = params
    const task = tasks[taskId]
    const file = task.room.attachments.find(attachment => attachment.id === objectId)

    return {
      type: file.mime === 'application/pdf' ? 'pdf' : 'image',
      name: file.name,
      url: file.url
    }
  }

  getDigitalForm() {
    const { deal, tasks, params } = this.props
    const { taskId } = params

    return extractDocumentOfTask(deal, tasks[taskId])
  }

  getEnvelopeFile() {
    const { deal, user, tasks, params } = this.props
    const { taskId, type, objectId } = params
    const envelope = deal.envelopes[objectId]
    const task = tasks[taskId]

    if (!task.submission || !envelope.documents) {
      return null
    }

    // get document index
    const doc = envelope.documents
      .find(doc => doc.submission === task.submission.id)

    if (!doc){
      return null
    }

    return {
      name: envelope.title,
      type: 'pdf',
      url: `${config.api_url}/envelopes/${envelope.id}/${doc.document_id}.pdf?access_token=${user.access_token}`
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
    browserHistory.goBack()
  }

  render() {
    const { file, showFactsheet, showComments } = this.state
    const { deal, tasks, params } = this.props
    const { name, type, url, downloadUrl } = file
    const task = tasks[params.taskId]

    const COMMENTS_WIDTH = showComments ? '300px' : '0px'
    const FACTSHEET_WIDTH = showFactsheet ? '300px' : '0px'
    const PDF_WIDTH = `calc(100% - ${COMMENTS_WIDTH} - ${FACTSHEET_WIDTH})`

    if (['pdf', 'image'].indexOf(type) === -1) {
      return null
    }

    return (
      <Modal
        className="deal-form-viewer-modal"
        show={true}
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
            { name }
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
                file && type === 'pdf' &&
                <PdfViewer
                  uri={url}
                  downloadUrl={downloadUrl}
                  defaultContainerHeight="85vh"
                />
              }

              {
                file && type === 'image' &&
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

function mapStateToProps({ user, deals }, props) {
  const { list } = deals
  const { dealId } = props.params

  return {
    user,
    formViewer: deals.formViewer,
    isBackOffice: deals.backoffice,
    deal: list && list[dealId] ? list[dealId] : null,
    tasks: deals.tasks
  }
}

export default connect(mapStateToProps)(FormViewer)
