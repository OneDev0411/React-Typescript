import React from 'react'
import PropTypes from 'prop-types'

require('intersection-observer')

import ProgressBar from 'components/ProgressBar'

import importPdfJs from 'utils/import-pdf-js'
import { getPdfSize } from 'models/Deal/form'

import WentWrong from '../../../components/Pages/Dashboard/Partials/UserMessages/WentWrong/index.js'

import { Container, LoadingDealContainer } from './styled'
import { Page } from './Page'
import { Toolbar } from './Toolbar'

export class PdfViewer extends React.Component {
  state = {
    isLoading: false,
    visiblePages: [1, 2],
    isFailed: true,
    document: null,
    downloadPercents: 1,
    rotation: 0,
    zoomScale: 0,
    isFitWindow: false
  }

  componentDidMount() {
    this.loadDocument()

    this.observer = new IntersectionObserver(this.onObserve, {
      root: null,
      rootMargin: '10% 0px 0px 0px',
      threshold: 0.2
    })
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyboardShortcuts)
  }

  onObserve = entries => {
    if (entries.length > 5) {
      return false
    }

    this.setState({
      visiblePages: entries.map(data => ~~data.target.dataset.page)
    })
  }

  handleZoomIn = () => {
    const zoomScale = this.state.zoomScale || 0

    if (zoomScale >= 5) {
      return false
    }

    this.setState({
      isFitWindow: false,
      zoomScale: parseFloat((zoomScale + 1).toFixed(1))
    })
  }

  handleFitWindow = () => {
    this.setState({
      zoomScale: 0,
      isFitWindow: true
    })
  }

  handleZoomOut = () => {
    const zoomScale = this.state.zoomScale || 0

    if (zoomScale <= -5) {
      return false
    }

    this.setState({
      isFitWindow: false,
      zoomScale: parseFloat((zoomScale - 1).toFixed(1))
    })
  }

  handleRotate = () => {
    const { rotation } = this.state
    const newRotation = rotation + 90 < 360 ? rotation + 90 : 0

    this.setState({
      rotation: newRotation
    })
  }

  goToPreviousPage = () => {
    const visiblePage = this.state.visiblePages[0]

    if (!visiblePage) {
      return false
    }

    const pageElement = document.getElementById(`page-${visiblePage - 1}`)

    if (pageElement) {
      pageElement.scrollIntoView()

      this.setState({
        visiblePages: [visiblePage - 1]
      })
    }
  }

  goToNextPage = () => {
    const visiblePage = this.state.visiblePages[
      this.state.visiblePages.length - 1
    ]

    if (!visiblePage) {
      return false
    }

    const pageElement = document.getElementById(`page-${visiblePage + 1}`)

    if (pageElement) {
      pageElement.scrollIntoView()

      this.setState({
        visiblePages: [visiblePage + 1]
      })
    }
  }

  loadDocument = async () => {
    if (this.state.isLoading) {
      return false
    }

    this.setState({ isLoading: true, isFailed: false })

    const PDFJS = await importPdfJs()

    const formSize = await getPdfSize({
      pdfUrl: this.props.url
    })

    if (!formSize) {
      this.setState({
        downloadPercents: Infinity
      })
    }

    const pdfDocument = PDFJS.getDocument({
      url: this.props.url,
      disableStream: true,
      disableAutoFetch: true,
      length: formSize
    })

    pdfDocument.onProgress = progress => {
      if (!progress.total) {
        return false
      }

      this.setState({
        downloadPercents: (progress.loaded / progress.total) * 100
      })

      document.addEventListener('keydown', this.handleKeyboardShortcuts)
    }

    pdfDocument
      .then(document => {
        this.setState({
          isLoading: false,
          downloadPercents: 100,
          document
        })
      })
      .catch(() => {
        this.setState({ isLoading: false, isFailed: true })
      })
  }

  handleKeyboardShortcuts = event => {
    const keyCode = event.keyCode || event.which

    switch (keyCode) {
      case 37:
        this.goToPreviousPage()
        break

      case 39:
        this.goToNextPage()
        break

      case 187:
        this.handleZoomIn()
        break

      case 189:
        this.handleZoomOut()
        break

      case 48:
        this.handleFitWindow()
        break
    }
  }

  render() {
    if (this.state.isFailed) {
      return (
        <LoadingDealContainer>
          <WentWrong />
        </LoadingDealContainer>
      )
    }

    if (!this.state.document || this.state.isLoading) {
      return (
        <LoadingDealContainer>
          {this.state.isLoading ? 'Loading File' : 'Opening File'}
          <ProgressBar
            percents={this.state.downloadPercents}
            indeterminate={this.state.downloadPercents === Infinity}
          />
        </LoadingDealContainer>
      )
    }

    return (
      <Container ref={ref => (this.pdfContainer = ref)}>
        {Array.apply(null, { length: this.state.document.numPages }).map(
          (v, i) => (
            <Page
              key={i}
              observer={this.observer}
              document={this.state.document}
              isFitWindow={this.state.isFitWindow}
              rotation={this.state.rotation}
              zoomScale={this.state.zoomScale}
              isVisible={this.state.visiblePages.includes(i + 1)}
              pageNumber={i + 1}
              totalPages={this.state.document.numPages}
            />
          )
        )}

        <Toolbar
          downloadLink={this.props.downloadUrl || this.props.url}
          onFitWindow={this.handleFitWindow}
          onZoomIn={this.handleZoomIn}
          onZoomOut={this.handleZoomOut}
          onRotate={this.handleRotate}
        />
      </Container>
    )
  }
}

PdfViewer.propTypes = {
  url: PropTypes.string.isRequired
}

PdfViewer.defaultProps = {}
