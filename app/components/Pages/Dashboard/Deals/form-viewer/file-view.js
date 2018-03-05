import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import DealInfo from '../dashboard/deal-info'
import Comments from '../dashboard/comments'
import CommentInput from '../dashboard/comments/input'
import Viewer from './viewer'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      disableKeyboardShortcuts: false
    }
  }

  render() {
    const { disableKeyboardShortcuts } = this.state
    const {
      deal,
      onClose,
      showFactsheet,
      showComments,
      toggleFactsheet,
      toggleComments,
      editFormHandler,
      splitPdfHandler,
      task,
      file,
      fileType
    } = this.props

    const COMMENTS_WIDTH = showComments ? '300px' : '0px'
    const FACTSHEET_WIDTH = showFactsheet ? '300px' : '0px'
    const PDF_WIDTH = `calc(100% - ${COMMENTS_WIDTH} - ${FACTSHEET_WIDTH})`

    return (
      <Modal className="deal-form-viewer-modal" show onHide={onClose}>
        <Modal.Header>
          <Button onClick={onClose} className="close-btn">
            X
          </Button>

          <span className="title">{task ? task.title : file.name}</span>

          <div className="cta">
            <Button className="deal-button" onClick={toggleFactsheet}>
              Deal Facts
            </Button>

            {task && (
              <Button className="deal-button comments" onClick={toggleComments}>
                Comments
              </Button>
            )}

            {file.type === 'pdf' && (
              <Button
                className="deal-button split"
                onClick={() => splitPdfHandler(file)}
              >
                Split PDF
              </Button>
            )}

            {fileType === 'digital-form' && (
              <Button
                className="deal-button edit-form"
                onClick={editFormHandler}
              >
                Edit Form
              </Button>
            )}
          </div>
        </Modal.Header>

        <Modal.Body>
          <div
            className={`fw-wrapper ${showFactsheet ? 'show-factsheet' : ''} ${
              showComments ? 'show-comments' : ''
            }`}
          >
            <div
              className="factsheet"
              style={{
                display: showFactsheet ? 'block' : 'none',
                minWidth: FACTSHEET_WIDTH,
                maxWidth: FACTSHEET_WIDTH
              }}
            >
              <DealInfo deal={deal} showBackButton={false} />
            </div>

            <Viewer
              file={file}
              width={PDF_WIDTH}
              disableKeyboardShortcuts={disableKeyboardShortcuts}
            />

            {task && (
              <div
                className="comments"
                style={{
                  display: showComments ? 'block' : 'none',
                  minWidth: COMMENTS_WIDTH,
                  maxWidth: COMMENTS_WIDTH
                }}
              >
                <Comments task={task} />

                <CommentInput
                  autoFocus={false}
                  task={task}
                  onFocus={() =>
                    this.setState({ disableKeyboardShortcuts: true })
                  }
                  onBlur={() =>
                    this.setState({ disableKeyboardShortcuts: false })
                  }
                />
              </div>
            )}
          </div>
        </Modal.Body>
      </Modal>
    )
  }
}
