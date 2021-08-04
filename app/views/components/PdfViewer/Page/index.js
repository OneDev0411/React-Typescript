import React from 'react'

import { Container, PageNumber } from './styled'

export class Page extends React.Component {
  state = {
    isLoading: false,
    isPageRendered: false
  }

  componentDidMount() {
    if (this.props.observer) {
      this.props.observer.observe(this.pageContainer)
    }

    this.renderPage(this.props.isVisible)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.isVisible &&
      !this.state.isPageRendered &&
      !this.state.isLoading
    ) {
      this.renderPage(true)
    }
  }

  getScale() {
    return this.props.quailtyScale || window.devicePixelRatio * 1.5
  }

  renderPage = async (isVisible = false) => {
    this.setState({
      isLoading: true
    })

    // load page
    const page = await this.props.document.getPage(this.props.pageNumber)

    const viewport = page.getViewport({
      scale: this.getScale()
    })
    const { width, height } = viewport
    const canvas = this.canvas

    if (!canvas) {
      return false
    }

    const context = canvas.getContext('2d')

    canvas.width = width
    canvas.height = height

    this.renderTask = page
      .render({
        canvasContext: context,
        viewport
      })
      .promise.then(() => {
        this.setState({
          isPageRendered: isVisible,
          isLoading: false
        })
      })
      .catch(e => {
        console.log(e)
      })
  }

  handleCanvasRef = ref => {
    this.canvas = ref
  }

  get ZoomSize() {
    const base = 85
    const calculated = base + this.props.zoomScale * 10

    return `${calculated}%`
  }

  get CanvasStyle() {
    const { rotation } = this.props

    const style = {
      width: this.ZoomSize,
      transform: `rotate(${rotation}deg)`
    }

    if (this.props.isFitWindow) {
      style.width = 'auto'
      style.height = '80vh'
    }

    return {
      ...style,
      ...this.props.canvasStyle
    }
  }

  render() {
    return (
      <Container
        id={`page-${this.props.pageNumber}`}
        ref={ref => (this.pageContainer = ref)}
        style={this.props.pageStyle}
        data-page={this.props.pageNumber}
        data-pdf={this.props.pdfId}
      >
        {this.props.headerRenderer &&
          this.props.headerRenderer({
            pageNumber: this.props.pageNumber,
            pagesCount: this.props.totalPages
          })}

        <canvas
          id="page-canvas"
          ref={this.handleCanvasRef}
          style={this.CanvasStyle}
        />

        {this.props.footerRenderer ? (
          this.props.footerRenderer({
            pageNumber: this.props.pageNumber,
            pagesCount: this.props.totalPages
          })
        ) : (
          <PageNumber>
            {this.props.pageNumber} / {this.props.totalPages}
          </PageNumber>
        )}
      </Container>
    )
  }
}
