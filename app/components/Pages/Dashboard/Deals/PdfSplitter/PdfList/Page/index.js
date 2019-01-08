import React from 'react'

import Spinner from 'components/Spinner'

import { Container, PageNumber } from './styled'

export class Page extends React.Component {
  state = {
    isLoading: false,
    isPageRendered: false
  }

  componentDidMount() {
    this.props.observer.observe(this.pageContainer)

    this.renderPage(this.props.isVisible)
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.isVisible &&
      !this.state.isPageRendered &&
      !this.state.isLoading
    ) {
      this.renderPage(true)
    }
  }

  getScale(isVisible) {
    const scale = window.devicePixelRatio * 1.5

    return isVisible ? scale : 0.2
  }

  renderPage = async (isVisible = false) => {
    this.setState({
      isLoading: true
    })

    // load page
    const page = await this.props.document.getPage(this.props.pageNumber)

    const viewport = page.getViewport(this.getScale(isVisible))
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
      .then(() => {
        this.setState({
          isLoading: false,
          isPageRendered: isVisible
        })
      })
  }

  get ZoomSize() {
    const base = 85
    const calculated = base + this.props.zoomScale * 10

    return `${calculated}%`
  }

  get PageStyle() {
    const { rotation } = this.props

    const style = {
      width: this.ZoomSize,
      transform: `rotate(${rotation}deg)`
    }

    if (this.props.isFitWindow) {
      style.width = 'auto'
      style.height = '80vh'
    }

    return style
  }

  render() {
    return (
      <Container
        ref={ref => (this.pageContainer = ref)}
        id={`page-${this.props.pageNumber}`}
        isLoading={this.state.isLoading}
        data-page={this.props.pageNumber}
      >
        {this.state.isLoading && <Spinner />}

        <canvas
          id="page-canvas"
          ref={ref => (this.canvas = ref)}
          style={this.PageStyle}
        />
        <PageNumber>
          {this.props.pageNumber} / {this.props.totalPages}
        </PageNumber>
      </Container>
    )
  }
}
