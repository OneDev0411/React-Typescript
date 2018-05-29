import React from 'react'
import { Button } from 'react-bootstrap'
import cn from 'classnames'

import DealInfo from '../dashboard/deal-info'
import Comments from '../dashboard/comments'
import CommentInput from '../dashboard/comments/input'
import Viewer from './viewer'
import IconEdit from '../../../../../views/components/SvgIcons/Edit/IconEdit'

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
      onPdfZoomIn,
      onPdfZoomOut,
      onClose,
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
            <span
              onClick={onClose}
              className="c-deal-form-viewer__header__back-btn"
            >
              <i className="fa fa-angle-left" />
            </span>
            <h1 className="c-deal-form-viewer__header__title">
              {decodeURI(file.name)}
            </h1>
          </div>

          <div className="c-deal-form-viewer__header__cta">
            {!isBackOffice &&
              fileType === 'digital-form' && (
                <Button
                  className="deal-button edit-form"
                  onClick={editFormHandler}
                >
                  <IconEdit />
                  <span>Edit Form</span>
                </Button>
              )}

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
          </div>
        </div>

        <div
          className={cn('c-deal-form-viewer__body', {
            'show-factsheet': showFactsheet === true,
            'show-comments': showComments === true
          })}
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
            onPdfZoomIn={onPdfZoomIn}
            onPdfZoomOut={onPdfZoomOut}
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
