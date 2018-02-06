import React from 'react'
import { connect } from 'react-redux'
import cn from 'classnames'
import { DragSource } from 'react-dnd'
import {
  selectSplitterPage,
  setPagePreview
} from '../../../../../../store_actions/deals'
import store from '../../../../../../stores'
import Page from '.'

/**
 * Specifies the drag source contract.
 */
const pageSource = {
  beginDrag(props) {
    return {
      documentId: props.pdfId,
      pageNumber: props.pageNumber
    }
  },
  canDrag(props, monitor) {
    return !props.inUse
  },
  endDrag(props, monitor, component) {
    if (!monitor.didDrop()) {
      return
    }

    const item = monitor.getItem()

    store.dispatch(selectSplitterPage(item.documentId, item.pageNumber))
  }
}

/**
 * Specifies which props to inject into your component.
 */
function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

class PageThumbnail extends React.Component {
  constructor(props) {
    super(props)
  }

  previewPage() {
    const {
      pdfId, doc, pageNumber, setPagePreview
    } = this.props

    setPagePreview({ pdfId, doc, pageNumber })
  }

  render() {
    const {
      connectDragSource,
      inUse,
      canvasClassName,
      pageNumber,
      pdfId,
      doc
    } = this.props

    const DragComponent = (
      <div className="inline">
        <Page
          containerHeight={158}
          zoom={2}
          canvasClassName={canvasClassName}
          pdfId={pdfId}
          doc={doc}
          pageNumber={pageNumber}
        >
          {!inUse && <div className="overlay" />}

          <span className="page-zoom-in" onClick={() => this.previewPage()}>
            <i className="fa fa-search" />
          </span>

          <span className="page-number">{pageNumber}</span>

          {this.props.children}
        </Page>
      </div>
    )

    return connectDragSource(DragComponent)
  }
}

const connectedPageThumbnail = connect(null, { setPagePreview })(PageThumbnail)
export default DragSource('SPLITTER_PDF_PAGE', pageSource, collect)(connectedPageThumbnail)
