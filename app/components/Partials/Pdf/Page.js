import React from 'react'

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
    const { pageNumber } = nextProps

    if (nextProps.pageNumber !== this.props.pageNumber)
      this.renderPage(pageNumber)
  }

  async setStateSync(states) {
    this.setState(states, () => true)
  }

  /**
   *
   */
  async renderPage(pageNumber) {
    const { doc, scale } = this.props

    // load page
    const page = await doc.getPage(pageNumber)

    const viewport = page.getViewport(scale)
    const { width, height } = viewport
    const canvas = this.container
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

    return (
      <div className="pdf-container" style={{ width, height }}>
        <canvas className="pdf-page" ref={canv => this.container = canv} />
      </div>
    )
  }
}

export default PdfPage

