import React from 'react'
import { DragSource } from 'react-dnd'

import { Page } from 'components/PdfViewer/Page'

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
  canDrag(props) {
    return props.isDraggable
  },
  endDrag(props, monitor) {
    if (!monitor.didDrop()) {
      return
    }

    const item = monitor.getItem()

    props.onEndDrag(item.documentId, item.pageNumber)
  }
}

/**
 * Specifies which props to inject into your component.
 */
function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  }
}

class DraggablePage extends React.Component {
  componentDidMount() {
    this.createDragPreview()
  }

  createDragPreview() {
    const img = new Image()

    img.src = '/static/images/deals/page-placeholder.jpg'

    img.onload = () => this.props.connectDragPreview(img)
  }

  render() {
    const { props } = this

    const DragComponent = (
      <div style={{ display: 'inline' }}>
        <Page {...props} />
      </div>
    )

    return this.props.connectDragSource(DragComponent)
  }
}

export default DragSource('SPLITTER_PDF_PAGE', pageSource, collect)(
  DraggablePage
)
