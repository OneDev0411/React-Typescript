import React from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import _ from 'underscore'
import Page from './Page'

class PdfViewer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      uri: null,
      loading: false,
      isFailed: false,
      doc: null,
      zoom: null,
      fitWindow: true
    }

    this.load = this.load.bind(this)
    this.docKeyboardShortcutHandler = this.docKeyboardShortcutHandler.bind(this)
  }

  componentDidMount() {
    const { uri } = this.props

    this.mounted = true

    if (uri) {
      this.load(uri)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { uri } = nextProps

    if (uri && uri !== this.props.uri) {
      this.load(uri)
    }
  }

  componentWillUnmount() {
    this.mounted = false
    document.removeEventListener('keydown', this.docKeyboardShortcutHandler)
  }

  docKeyboardShortcutHandler(event) {
    const { disableKeyboardShortcuts, onZoomIn, onZoomOut } = this.props

    if (disableKeyboardShortcuts) {
      return false
    }

    const keyCode = event.keyCode || event.which
    const $viewerContainer = this.$pdfContext.parentElement.parentElement
    const pdfPageHeight =
      this.$pdfContext.firstElementChild.firstElementChild.offsetHeight + 45

    switch (keyCode) {
      case 40:
        // arrow down
        $viewerContainer.scrollTo(0, $viewerContainer.scrollTop + 50)
        break
      case 38:
        // arrow up
        $viewerContainer.scrollTo(0, $viewerContainer.scrollTop - 50)
        break
      case 37:
        // arrow backward = previous page
        $viewerContainer.scrollTo(0, $viewerContainer.scrollTop - pdfPageHeight)
        break
      case 39:
        // arrow forward = next page
        $viewerContainer.scrollTo(0, $viewerContainer.scrollTop + pdfPageHeight)
        break
      case 187:
        this.zoomIn()
        onZoomIn && onZoomIn()
        break
      case 189:
        this.zoomOut()
        onZoomOut && onZoomOut()
        break
      case 48:
        this.fitWindow()
        break
      default:
        break
    }
  }

  async load(uri) {
    if (this.state.loading || uri === this.state.uri) {
      return false
    }

    // lazy load
    await import('pdfjs-dist/build/pdf.combined' /* webpackChunkName: "pdf.combined" */)
    await import('pdfjs-dist/web/compatibility' /* webpackChunkName: "pdf.comp" */)

    this.setState({
      uri,
      isFailed: false,
      loading: true,
      doc: null,
      rotation: 0
    })

    try {
      const doc = await PDFJS.getDocument(uri)

      // trigger when load is completed
      if (!this.mounted) {
        return false
      }

      // set states
      this.setState({ doc, loading: false }, () => {
        document.addEventListener('keydown', this.docKeyboardShortcutHandler)
      })

      // trigger onLoaded event
      if (this.props.onLoad && typeof this.props.onLoad === 'function') {
        this.props.onLoad()
      }
    } catch (e) {
      this.setState({ uri: null, loading: false, isFailed: true })
    }
  }

  rotate() {
    const { rotation } = this.state
    const newRotation = rotation + 90 < 360 ? rotation + 90 : 0

    this.setState({
      rotation: newRotation
    })
  }

  zoomIn() {
    const { onZoomIn } = this.props
    const zoom = this.state.zoom || 0

    if (zoom >= 0.6) {
      return false
    }

    this.setState({
      fitWindow: false,
      zoom: parseFloat((zoom + 0.3).toFixed(1))
    })

    if (onZoomIn) {
      onZoomIn()
    }
  }

  zoomOut() {
    const { onZoomOut } = this.props
    const zoom = this.state.zoom || 0

    if (zoom <= -0.3) {
      return false
    }

    this.setState({
      fitWindow: false,
      zoom: parseFloat((zoom - 0.3).toFixed(1))
    })

    if (onZoomOut) {
      onZoomOut()
    }
  }

  fitWindow() {
    this.setState({
      fitWindow: true,
      zoom: null
    })
  }

  render() {
    const { doc, fitWindow, rotation, zoom, loading, isFailed } = this.state
    const { defaultContainerHeight, downloadUrl, uri } = this.props

    return (
      <div className="c-pdf-viewer">
        {loading && (
          <div className="loading center">
            <i className="fa fa-spin fa-spinner fa-2x" />
            <p>Loading document</p>
          </div>
        )}

        {isFailed && (
          <div style={{ maxWidth: '40rem', margin: '0 auto' }}>
            <div className="c-alert c-alert--error">
              <p>We weren’t able to create a document preview.</p>
              <button
                onClick={() => this.load(uri)}
                className="btn btn-primary c-button--link"
              >
                Refresh
              </button>
            </div>
          </div>
        )}

        {doc && (
          <div className="pdf-context" ref={ref => (this.$pdfContext = ref)}>
            <div className="wrapper">
              {Array.apply(null, { length: doc.pdfInfo.numPages }).map(
                (v, i) => (
                  <Page
                    key={`page-${i}`}
                    doc={doc}
                    fitWindow={fitWindow}
                    rotation={rotation}
                    zoom={zoom}
                    defaultContainerHeight={defaultContainerHeight || '85vh'}
                    pageNumber={i + 1}
                  />
                )
              )}
            </div>

            <div className="pdf-toolbar">
              <OverlayTrigger
                placement="left"
                overlay={<Tooltip>Rotate Pdf</Tooltip>}
              >
                <i
                  className="fa fa-rotate-right"
                  onClick={() => this.rotate()}
                />
              </OverlayTrigger>

              <OverlayTrigger
                placement="left"
                overlay={<Tooltip>Zoom In</Tooltip>}
              >
                <i
                  className="fa fa-plus-circle"
                  onClick={() => this.zoomIn()}
                />
              </OverlayTrigger>

              <OverlayTrigger
                placement="left"
                overlay={<Tooltip>Zoom Out</Tooltip>}
              >
                <i
                  className="fa fa-minus-circle"
                  onClick={() => this.zoomOut()}
                />
              </OverlayTrigger>

              <OverlayTrigger
                placement="left"
                overlay={<Tooltip>Automatic Zoom</Tooltip>}
              >
                <i
                  className="fa fa-square-o"
                  onClick={() => this.fitWindow()}
                />
              </OverlayTrigger>

              <OverlayTrigger
                placement="left"
                overlay={<Tooltip>Download Pdf</Tooltip>}
              >
                <a target="_blank" href={downloadUrl || uri}>
                  <i className="fa fa-download" />
                </a>
              </OverlayTrigger>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default PdfViewer
