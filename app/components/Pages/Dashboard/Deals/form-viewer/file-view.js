import React from 'react'
import { Link } from 'react-router'
import { Button } from 'react-bootstrap'
import cn from 'classnames'

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
      isBackOffice,
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
      <div className="c-deal-form-viewer">
        <div className="c-deal-form-viewer__header">
          <div>
            <Link
              to={`/dashboard/deals/${deal.id}`}
              className="c-deal-form-viewer__header__back-btn"
            >
              <i className="fa fa-angle-left" />
            </Link>
            <h1 className="c-deal-form-viewer__header__title">
              {task ? task.title : file.name}
            </h1>
          </div>

          <div className="c-deal-form-viewer__header__cta">
            <Button
              className={cn('deal-button', { 'is-active': showFactsheet })}
              onClick={toggleFactsheet}
            >
              Deal Facts
            </Button>

            {task && (
              <Button
                className={cn('deal-button comments', {
                  'is-active': showComments
                })}
                onClick={toggleComments}
              >
                Comments
              </Button>
            )}

            {!isBackOffice &&
              file.type === 'pdf' && (
                <Button
                  className="deal-button split"
                  onClick={() => splitPdfHandler(file)}
                >
                  Split PDF
                </Button>
              )}

            {!isBackOffice &&
              fileType === 'digital-form' && (
                <Button
                  className="deal-button edit-form"
                  onClick={editFormHandler}
                >
                  Edit Form
                </Button>
              )}
          </div>
        </div>

        <div
          className={`c-deal-form-viewer__body ${
            showFactsheet ? 'show-factsheet' : ''
          } ${showComments ? 'show-comments' : ''}`}
        >
          <div
            className="c-deal-form-viewer__factsheet"
            style={{
              display: showFactsheet ? 'block' : 'none',
              width: FACTSHEET_WIDTH
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
              className="c-deal-form-viewer__comments"
              style={{
                display: showComments ? 'block' : 'none',
                width: COMMENTS_WIDTH
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
      </div>
    )
  }
}
