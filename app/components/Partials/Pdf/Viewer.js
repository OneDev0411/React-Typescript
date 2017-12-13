import React from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import _ from 'underscore'
import Page from './Page'

class PdfViewer extends React.Component {

  constructor(props) {
    super(props)

    // set component mounted
    this.mounted = true

    this.state = {
      uri: null,
      loading: false,
      doc: null,
      zoom: null,
      fitWindow: true
    }
  }

  componentDidMount() {
    const { uri } = this.props
    this.mounted = true

    if (uri) {
      this.load(uri)
    }

    this.bindedKeyDown = this.onKeyDown.bind(this)
    window.addEventListener('keydown', this.bindedKeyDown)
  }

  componentWillReceiveProps(nextProps) {
    const { uri } = nextProps

    if (uri && uri !== this.props.uri) {
      this.load(uri)
    }
  }

  componentWillUnmount() {
    this.mounted = false
    window.removeEventListener('keydown', this.bindedKeyDown)
  }

  onKeyDown(e) {
    const { enableKeyboardShortcuts } = this.props
    if (!enableKeyboardShortcuts) {
      return false
    }

    const code = (e.keyCode || e.which)
    const doc = document.documentElement
    const pdfCanvas = document.getElementById('pdf-canvas')
    const moveSize = pdfCanvas.clientHeight
    const top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0)

    switch (code) {
      case 40: // press arrow down
        return this.pdf_context.scrollTop = top + moveSize
      case 38: // press arrow up
        return this.pdf_context.scrollTop = top - moveSize
      case 48: // press 0 button
        return this.fitWindow()
      case 187: // press +
        return this.zoomIn()
      case 189: // press -
        return this.zoomOut()
    }
  }

  async load(uri) {
    if (this.state.loading || uri === this.state.uri) {
      return false
    }

    // lazy load
    await import('pdfjs-dist/build/pdf.combined' /* webpackChunkName: "pdf.combined" */ )
    await import('pdfjs-dist/web/compatibility' /* webpackChunkName: "pdf.comp" */)

    this.setState({
      uri,
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
      this.setState({ doc, loading: false })

      // trigger onLoaded event
      this.props.onLoad()

    } catch (e) {
      this.setState({ uri: null, loading: false })
    }
  }

  rotate() {
    const { rotation } = this.state
    const newRotation = rotation + 90 < 360 ? rotation + 90 : 0
    this.setState({
      rotation: newRotation,
    })
  }

  zoomIn() {
    const zoom = this.state.zoom || 0
    if (zoom >= 0.6) {
      return false
    }

    this.setState({
      fitWindow: false,
      zoom: parseFloat((zoom + 0.3).toFixed(1))
    })
  }

  zoomOut() {
    const zoom = this.state.zoom || 0

    if (zoom <= -0.3) {
      return false
    }

    this.setState({
      fitWindow: false,
      zoom: parseFloat((zoom - 0.3).toFixed(1))
    })
  }

  fitWindow() {
    this.setState({
      fitWindow: true,
      zoom: null
    })
  }

  render() {
    const { doc, fitWindow, rotation, zoom, loading } = this.state
    const { defaultContainerHeight, uri, downloadUrl } = this.props

    return (
      <div>
        {
          loading &&
          <div className="loading center">
            <i className="fa fa-spin fa-spinner fa-2x" />
            <p>Loading document</p>
          </div>
        }

        {
          doc && !loading &&
          <div
            className="pdf-context"
            ref={ref => this.pdf_context = ref}
          >
            <div className="wrapper">
              {
                Array.apply(null, { length: doc.pdfInfo.numPages })
                .map((v, i) => (
                  <Page
                    key={`page-${i}`}
                    doc={doc}
                    fitWindow={fitWindow}
                    rotation={rotation}
                    zoom={zoom}
                    defaultContainerHeight={defaultContainerHeight || '85vh'}
                    pageNumber={i+1}
                  />
                ))
              }
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
        }
      </div>
    )
  }
}

export default PdfViewer
