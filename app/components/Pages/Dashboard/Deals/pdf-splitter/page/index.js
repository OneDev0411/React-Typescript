import React from 'react'
import cn from 'classnames'
import { DragSource } from 'react-dnd'
import { selectSplitterPage } from '../../../../../../store_actions/deals'
import store from '../../../../../../stores'

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
    return props.isDraggable && !props.inUse
  },
  endDrag(props, monitor) {
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
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  }
}

class Page extends React.Component {
  componentDidMount() {
    const { pageNumber } = this.props

    this.createDragPreview()
    this.renderPage(pageNumber)
  }

  createDragPreview() {
    const img = new Image()

    img.src = '/static/images/deals/page-placeholder.jpg'
    img.onload = () => this.props.connectDragPreview(img)
  }

  async calculateScale(pageNumber) {
    const { doc, zoom, containerHeight } = this.props
    const page = await doc.getPage(pageNumber)
    const viewport = page.getViewport(1)

    let height = containerHeight

    if (containerHeight.toString().includes('%')) {
      const percent = ~~containerHeight.slice(0, -1)

      height = ~~(percent * window.innerHeight / 100)
    }

    return height / viewport.height * zoom
  }

  /**
   *
   */
  async renderPage(pageNumber) {
    const { doc } = this.props

    // load page
    const page = await doc.getPage(pageNumber)
    const scale = await this.calculateScale(pageNumber)
    const viewport = page.getViewport(scale)

    const { width, height } = viewport
    const canvas = this.canvas

    if (!canvas) {
      return false
    }

    const context = canvas.getContext('2d')

    canvas.width = width
    canvas.height = height

    page.render({
      canvasContext: context,
      viewport
    })
  }

  render() {
    const { pageNumber, size, canvasClassName, connectDragSource } = this.props

    const DragComponent = (
      <div
        className={cn('page-container', size)}
        ref={ref => (this.container = ref)}
      >
        <canvas
          id={`pdf-page-canvas-${pageNumber}`}
          ref={ref => (this.canvas = ref)}
          className={cn('page-canvas', canvasClassName, size)}
        />

        {this.props.children}
      </div>
    )

    return connectDragSource(DragComponent)
  }
}

export default DragSource('SPLITTER_PDF_PAGE', pageSource, collect)(Page)
