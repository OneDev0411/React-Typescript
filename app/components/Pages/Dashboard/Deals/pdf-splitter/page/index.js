import React from 'react'
import cn from 'classnames'

class Page extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { pageNumber } = this.props

    this.renderPage(pageNumber)
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
    const { pageNumber, canvasClassName } = this.props

    return (
      <div className="page-container" ref={ref => (this.container = ref)}>
        <canvas
          id={`pdf-page-canvas-${pageNumber}`}
          ref={ref => (this.canvas = ref)}
          className={cn('page-canvas', canvasClassName)}
        />

        {this.props.children}
      </div>
    )
  }
}

export default Page
