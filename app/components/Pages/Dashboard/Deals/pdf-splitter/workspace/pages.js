import React from 'react'
import { connect } from 'react-redux'
import cn from 'classnames'
import _ from 'underscore'
import { DropTarget } from 'react-dnd'
import { deselectSplitterPage } from '../../../../../../store_actions/deals'
import PageThumbnail from '../page/thumbnail'
import EmptyState from './empty-state'

/**
 * Specifies which props to inject into your component.
 */
function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType()
  }
}

class WorkspacePdfList extends React.Component {
  constructor(props) {
    super(props)
  }

  deselectPage(documentId, pageNumber) {
    this.props.deselectSplitterPage(documentId, pageNumber)
  }

  render() {
    const { isOver, canDrop, connectDropTarget, splitter } = this.props
    const { pdfObjects } = splitter

    const DropTarget = (
      <div className={cn('pdfholder', { canDrop: isOver && canDrop })}>
        {_.size(splitter.pages) === 0 && <EmptyState />}

        {_.map(splitter.pages, (page, id) => (
          <PageThumbnail
            key={`pdf-page-${id}`}
            inUse
            size="small"
            canvasClassName="no-drag"
            pdfId={page.documentId}
            doc={pdfObjects[page.documentId]}
            pageNumber={page.pageNumber}
          >
            <span
              className="page-cta remove"
              onClick={() =>
                this.deselectPage(page.documentId, page.pageNumber)
              }
            >
              Remove
            </span>
          </PageThumbnail>
        ))}
      </div>
    )

    return connectDropTarget(DropTarget)
  }
}

const connectedWorkSpacePdfList = connect(null, { deselectSplitterPage })(
  WorkspacePdfList
)

export default DropTarget('SPLITTER_PDF_PAGE', {}, collect)(
  connectedWorkSpacePdfList
)
