import React from 'react'
import { findDOMNode } from 'react-dom'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import cn from 'classnames'
import _ from 'underscore'
import { DropTarget } from 'react-dnd'
import PageThumbnail from '../page/thumbnail'
import TasksDropDown from '../../tasks-dropdown'
import Checkbox from '../../../../components/radio'
import { deselectSplitterPage } from '../../../../../../../../store_actions/deals'

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
    const { isOver, canDrop, connectDropTarget, splitter, upload } = this.props

    return connectDropTarget(
      <div className={cn('pdfholder', { canDrop: isOver && canDrop })}>
        {
          _.map(splitter.pages, (page, id) =>
            <PageThumbnail
              key={`pdf-page-${id}`}
              inUse={true}
              canvasClassName="no-drag"
              pdfId={page.documentId}
              doc={splitter.documents[page.documentId]}
              pageNumber={page.pageNumber}
            >
              <span
                className="page-cta remove"
                onClick={() => this.deselectPage(page.documentId, page.pageNumber)}
              >
                Remove
              </span>
            </PageThumbnail>
          )
        }
      </div>
    )
  }
}

const connectedWorkSpacePdfList = connect(null, { deselectSplitterPage })(WorkspacePdfList)
export default DropTarget('SPLITTER_PDF_PAGE', {}, collect)(connectedWorkSpacePdfList)
