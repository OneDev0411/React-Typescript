import React from 'react'
import cn from 'classnames'

import DealInfo from '../dashboard/deal-info'
import Comments from '../dashboard/comments'
import CommentInput from '../dashboard/comments/input'
import Viewer from './viewer'

import PageHeader from '../../../../../views/components/PageHeader'
import ActionButton from '../../../../../views/components/Button/ActionButton'

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
      showFactsheet,
      showComments,
      toggleFactsheet,
      toggleComments,
      onPdfZoomIn,
      onPdfZoomOut,
      task,
      file
    } = this.props

    const COMMENTS_WIDTH = showComments ? '300px' : '0px'
    const FACTSHEET_WIDTH = showFactsheet ? '300px' : '0px'
    const PDF_WIDTH = `calc(100% - ${COMMENTS_WIDTH} - ${FACTSHEET_WIDTH})`

    return (
      <div className="c-deal-form-viewer">
        <PageHeader
          title={decodeURI(file.name)}
          backUrl={`/dashboard/deals/${deal.id}`}
        >
          <PageHeader.Menu>
            <ActionButton
              className={cn({ 'is-active': showFactsheet })}
              onClick={toggleFactsheet}
              style={{ padding: '0.75em', marginRight: '8px' }}
            >
              Deal Facts
            </ActionButton>

            {task && (
              <ActionButton
                className={cn('comments', {
                  'is-active': showComments
                })}
                style={{ padding: '0.75em' }}
                onClick={toggleComments}
              >
                Comments
              </ActionButton>
            )}
          </PageHeader.Menu>
        </PageHeader>

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
                deal={deal}
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
