import React from 'react'
import { connect } from 'react-redux'
import cn from 'classnames'
import { DragSource } from 'react-dnd'
import { setSplitterPage } from '../../../../../../../store_actions/deals'
import store from '../../../../../../../stores'

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
    store.dispatch(setSplitterPage(item.documentId, item.pageNumber))
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

class Page extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      width: 0,
      height: 0,
      page: null
    }
  }

  componentDidMount() {
    const { pageNumber } = this.props
    this.renderPage(pageNumber)
  }

  async calculateScale(pageNumber) {
    const { doc } = this.props
    const page = await doc.getPage(pageNumber)
    const viewport = page.getViewport(1)

    return (158 / viewport.height) * 2
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

    // set states
    await this.setState({ page, width, height })
  }

  render() {
    const { isDragging, connectDragSource, canvasClassName, pageNumber } = this.props

    return connectDragSource(
      <div
        className="page-container"
        ref={ref => this.container = ref}
      >
        <canvas
          id={`pdf-page-canvas-${pageNumber}`}
          ref={ref => this.canvas = ref}
          className={cn('page-canvas', canvasClassName)}
        />

        <span className="page-number">
          { pageNumber }
        </span>

        { this.props.children }
      </div>
    )
  }

}

export default DragSource('SPLITTER_PDF_PAGE', pageSource, collect)(Page)

