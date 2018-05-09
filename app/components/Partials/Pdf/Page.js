import React from 'react'
import _ from 'underscore'

class PdfPage extends React.Component {
  constructor(props) {
    super(props)
    this.renderTask = null

    this.state = {
      height: 0,
      fitScale: null
    }
  }

  componentWillMount() {
    this.delayedWindowResize = _.debounce(this.onResize.bind(this), 10)
    window.addEventListener('resize', this.delayedWindowResize.bind(this))
  }

  componentDidMount() {
    const { pageNumber, fitWindow } = this.props

    this.renderPage(pageNumber, 0, fitWindow)
  }

  componentWillReceiveProps(nextProps) {
    const { pageNumber, scale, fitWindow, zoom } = nextProps
    const currentPageNumber = this.props.pageNumber
    const currentScale = this.props.scale
    const currentZoom = this.props.zoom
    const currentFitWindow = this.props.fitWindow

    if (
      pageNumber !== currentPageNumber ||
      scale !== currentScale ||
      zoom !== currentZoom ||
      fitWindow !== currentFitWindow
    ) {
      this.renderPage(pageNumber, zoom, fitWindow)
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.delayedWindowResize.bind(this))
  }

  async setStateSync(states) {
    return new Promise(resolve => this.setState(states, resolve))
  }

  onResize() {
    const { pageNumber, zoom, fitWindow } = this.props

    this.renderPage(pageNumber, zoom, fitWindow)
  }

  async calculateScale(pageNumber, ratio = 'height') {
    const { doc } = this.props
    const { container } = this

    if (!container) {
      return null
    }

    const height = container.clientHeight
    const width = container.clientWidth

    const page = await doc.getPage(pageNumber)
    const viewport = page.getViewport(1)

    if (ratio === 'height') {
      return height / viewport.height
    }

    return width / 1.25 / viewport.width
  }

  /**
   *
   */
  async renderPage(pageNumber, zoom = 0, fitWindow = false) {
    const { doc } = this.props
    const { fitScale } = this.state

    let newScale = 1

    if (fitWindow) {
      newScale = fitScale || (await this.calculateScale(pageNumber))
    } else {
      newScale = await this.calculateScale(pageNumber, 'width')
    }

    if (!fitScale) {
      this.setState({ fitScale: newScale })
    }

    if (zoom && zoom !== 0) {
      newScale = 1 + zoom
    }

    // load page
    const page = await doc.getPage(pageNumber)

    if (this.renderTask) {
      this.renderTask.cancel()
    }

    const viewport = page.getViewport(newScale + zoom)
    const { width, height } = viewport
    const canvas = this.canvas

    if (!canvas) {
      return false
    }

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
    const { height } = this.state
    const { doc, pageNumber, rotation, zoom, defaultContainerHeight } = this.props
    const { pdfInfo } = doc
    const { numPages } = pdfInfo

    return (
      <div
        className="pdf-container"
        style={{
          height: height > 0 && zoom !== null ? height : defaultContainerHeight
        }}
        ref={ref => (this.container = ref)}
      >
        <a name={`p${pageNumber}`}>
          <canvas
            className={`pdf-page rotate${rotation}`}
            id="pdf-canvas"
            ref={ref => (this.canvas = ref)}
          />
          <div className="page-number">{pageNumber} / {numPages}</div>
        </a>
      </div>
    )
  }
}

export default PdfPage
