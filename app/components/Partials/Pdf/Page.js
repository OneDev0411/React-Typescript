import React from 'react'
import ReactResizeDetector from 'react-resize-detector'

class PdfPage extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      page: null,
      width: 0,
      height: 0
    }
  }

  componentDidMount() {
    const { pageNumber } = this.props
    this.renderPage(pageNumber)
  }

  componentWillReceiveProps(nextProps) {
    const { pageNumber, scale } = nextProps
    const currentPageNumber = this.props.pageNumber
    const currentScale = this.props.scale

    if (pageNumber !== currentPageNumber || scale !== currentScale) {
      this.renderPage(pageNumber)
    }
  }

  async setStateSync(states) {
    this.setState(states, () => true)
  }

  onResize() {
    const { pageNumber } = this.props
    this.renderPage(pageNumber)
  }

  async calculateScale(pageNumber) {
    const { doc } = this.props

    if (!this.container) {
      return null
    }

    const width = this.container.clientWidth

    const page = await doc.getPage(pageNumber)
    const viewport = page.getViewport(1)

    return width / viewport.width
  }

  /**
   *
   */
  async renderPage(pageNumber) {
    const { doc } = this.props
    let { scale } = this.props

    if (scale === 'auto') {
      scale = await this.calculateScale(pageNumber)
    }

    if (scale === null) {
      return false
    }

    // load page
    const page = await doc.getPage(pageNumber)
    const viewport = page.getViewport(scale)

    const { width, height } = viewport
    const canvas = this.canvas
    const context = canvas.getContext('2d')
    canvas.width = width
    canvas.height = height

    page.render({
      canvasContext: context,
      viewport
    })

    // set states
    await this.setStateSync({ page, width, height })
  }

  render() {
    const { width, height } = this.state
    const { scale } = this.props
    const containerStyle = {}

    if (scale !== 'auto') {
      containerStyle.width = width
      containerStyle.height = height
    }

    return (
      <div
        className="pdf-container"
        style={containerStyle}
        ref={ref => this.container = ref}
      >
        <ReactResizeDetector
          handleWidth
          onResize={() => this.onResize()}
        />

        <canvas
          className="pdf-page"
          ref={ref => this.canvas = ref}
        />
      </div>
    )
  }
}

export default PdfPage

