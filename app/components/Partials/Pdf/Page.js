import React from 'react'
import ReactResizeDetector from 'react-resize-detector'
import _ from 'underscore'

class PdfPage extends React.Component {

  constructor(props) {
    super(props)
    this.renderTask = null

    this.state = {
      page: null,
      width: 0,
      height: 0
    }
  }

  componentWillMount() {
    this.delayedWindowResize = _.debounce(this.onResize.bind(this), 10)
    window.addEventListener("resize", this.delayedWindowResize.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.delayedWindowResize.bind(this));
  }

  componentDidMount() {
    const { pageNumber } = this.props
    this.renderPage(pageNumber)
  }

  componentWillReceiveProps(nextProps) {
    const { pageNumber, scale, zoom } = nextProps
    const currentPageNumber = this.props.pageNumber
    const currentScale = this.props.scale
    const currentZoom = this.props.zoom

    if (pageNumber !== currentPageNumber ||
      scale !== currentScale ||
      zoom !== currentZoom
    ) {
      this.renderPage(pageNumber, zoom)
    }
  }

  async setStateSync(states) {
    return new Promise(resolve => this.setState(states, resolve))
  }

  onResize() {
    console.log('RESIZE')
    const { pageNumber, zoom } = this.props
    this.renderPage(pageNumber, zoom)
  }

  async calculateScale(pageNumber) {
    const { doc } = this.props
    const { container } = this

    if (!container) {
      return null
    }

    const height = container.clientHeight

    const page = await doc.getPage(pageNumber)
    const viewport = page.getViewport(1)

    console.log('======>', height, viewport.height)
    return height / viewport.height
  }

  /**
   *
   */
  async renderPage(pageNumber, zoom = 0) {
    const { scale, doc } = this.props
    let newScale

    console.log(scale, zoom)
    if (scale === 'auto' && !zoom) {
      newScale = await this.calculateScale(pageNumber)
    }

    if (zoom > 0) {
      newScale = 1 + zoom
    }

    console.log(newScale)

    if (newScale === null) {
      return false
    }

    // load page
    const page = await doc.getPage(pageNumber)

    if (this.renderTask) {
      this.renderTask.cancel()
    }

    const viewport = page.getViewport(newScale + zoom)
    const { width, height } = viewport
    const canvas = this.canvas
    const context = canvas.getContext('2d')
    canvas.width = width
    canvas.height = height

    this.renderTask = page.render({
      canvasContext: context,
      viewport
    })

    // set states
    await this.setStateSync({ page, width, height })
  }

  render() {
    const { width, height } = this.state
    const {
      scale,
      pageNumber,
      rotation,
      zoom,
      containerHeight
    } = this.props

    const containerStyle = {
      width,
      height: zoom !== null && height > 0 ? height : containerHeight
    }

    return (
      <div
        className="pdf-container"
        style={containerStyle}
        ref={ref => this.container = ref}
      >

        <canvas
          className={`pdf-page rotate${rotation}`}
          ref={ref => this.canvas = ref}
        />

        <div className="page-number">
          - {pageNumber} -
        </div>
      </div>
    )
  }
}

export default PdfPage

