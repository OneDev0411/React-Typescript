import React from 'react'
import { connect } from 'react-redux'
import cn from 'classnames'

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
    const { pageNumber } = this.props

    return (
      <div
        className="page-container"
        ref={ref => this.container = ref}
      >
        <canvas
          className="page-canvas"
          id={`pdf-page-canvas-${pageNumber}`}
          ref={ref => this.canvas = ref}
        />

        <span className="page-number">
          { pageNumber }
        </span>

        <span className="select-page">
          Add page
        </span>
      </div>
    )
  }

}

export default connect(null)(Page)
