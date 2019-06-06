import React from 'react'

export default class Page extends React.Component {
  shouldComponentUpdate() {
    return false
  }

  renderPage = async canvas => {
    if (!canvas) {
      return false
    }

    const page = await this.props.document.getPage(this.props.page)

    const viewport = page.getViewport({
      scale: this.props.scale
    })
    const { width, height } = viewport
    const context = canvas.getContext('2d')

    canvas.width = width
    canvas.height = height

    canvas.style.width = `${this.props.displayWidth}px`

    page.render({
      renderInteractiveForms: true,
      enableWebGL: true,
      canvasContext: context,
      viewport
    })
  }

  render() {
    return <canvas ref={this.renderPage} />
  }
}
