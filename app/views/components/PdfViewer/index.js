import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@material-ui/core'

require('intersection-observer')

import ProgressBar from 'components/ProgressBar'

import importPdfJs from 'utils/import-pdf-js'
import { getPdfSize } from 'models/Deal/form'

import { Container, LoadingDealContainer } from './styled'
import { Page } from './Page'
import { Toolbar } from './Toolbar'

export class PdfViewer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: false,
      visiblePages: [1, 2],
      isFailed: false,
      document: null,
      downloadPercents: 1,
      rotation: 0,
      zoomScale: 0,
      isFitWindow: false
    }

    document.addEventListener('keydown', this.handleKeyboardShortcuts)
  }

  componentDidMount() {
    this.loadDocument()

    this.observer = new IntersectionObserver(this.onObserve, {
      root: null,
      rootMargin: '10% 0px 0px 0px',
      threshold: 0.2
    })
    document.body.style.overflow = 'hidden'
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyboardShortcuts)
    document.body.style.overflow = 'unset'
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
    this.setState(state => {
      const zoomScale = state.zoomScale || 0

      if (zoomScale >= 5) {
        return state
      }

      return {
        isFitWindow: false,
        zoomScale: parseFloat((zoomScale + 1).toFixed(1))
      }
    })
  }

  handleFitWindow = () => {
    this.setState({
      zoomScale: 0,
      isFitWindow: true
    })
  }

  handleZoomOut = () => {
    this.setState(state => {
      const zoomScale = state.zoomScale || 0

      if (zoomScale <= -5) {
        return state
      }

      return {
        isFitWindow: false,
        zoomScale: parseFloat((zoomScale - 1).toFixed(1))
      }
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

    this.setState({ isLoading: true })

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
    }

    pdfDocument
      .then(document => {
        this.setState({
          isLoading: false,
          downloadPercents: 100,
          document
        })
      })
      .catch(e => {
        console.log(e)
        this.setState({ isLoading: false, isFailed: true })
      })
  }

  handleKeyboardShortcuts = event => {
    if (!this.state.document) {
      return false
    }

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

  /**
   *  this error happening when browser can't download pdf.js bundle
   *  due to network issues and a reload will resolve it
   */
  handleReloadPage = () => window.location.reload()

  render() {
    if (this.state.isFailed) {
      return (
        <LoadingDealContainer>
          It seems you have encountered an unknown system issue and your browser
          couldn't run the PDF viewer.
          <Button
            variant="contained"
            color="primary"
            onClick={this.handleReloadPage}
          >
            Try Again
          </Button>
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
      <>
        <Toolbar
          downloadLink={this.props.downloadUrl || this.props.url}
          onFitWindow={this.handleFitWindow}
          onZoomIn={this.handleZoomIn}
          onZoomOut={this.handleZoomOut}
          onRotate={this.handleRotate}
        />
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
        </Container>
      </>
    )
  }
}

PdfViewer.propTypes = {
  url: PropTypes.string.isRequired
}

PdfViewer.defaultProps = {}
