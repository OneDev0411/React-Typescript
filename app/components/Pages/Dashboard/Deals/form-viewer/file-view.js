import React, { Fragment } from 'react'
import cn from 'classnames'

import DealInfo from '../dashboard/deal-info'
import Comments from '../dashboard/comments'
import CommentInput from '../dashboard/comments/input'
import Viewer from './viewer'

import PageHeader from '../../../../../views/components/PageHeader'
import ActionButton from '../../../../../views/components/Button/ActionButton'

const CommentsButton = ActionButton.extend`
  margin-left: 1em;
`
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
      <Fragment>
        <PageHeader
          title={decodeURI(file.name)}
          backUrl={`/dashboard/deals/${deal.id}`}
        >
          <PageHeader.Menu>
            <ActionButton onClick={toggleFactsheet}>Deal Facts</ActionButton>

            {task && (
              <CommentsButton onClick={toggleComments}>Comments</CommentsButton>
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
      </Fragment>
    )
  }
}
