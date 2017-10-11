import React from 'react'
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
      zoom: null
    }
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
    if (zoom >= 1.5) {
      return false
    }

    this.setState({
      zoom: zoom + 0.5
    })
  }

  zoomOut() {
    const zoom = this.state.zoom || 0

    if (zoom <= 0) {
      return false
    }

    this.setState({
      zoom: zoom - 0.5
    })
  }

  fitWindow() {
    this.setState({
      zoom: null
    })
  }

  render() {
    const { doc, rotation, zoom, loading } = this.state
    const { scale, containerHeight } = this.props

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
          <div className="pdf-context">
            <div className="wrapper">
              {
                Array.apply(null, { length: doc.pdfInfo.numPages })
                .map((v, i) => (
                  <Page
                    key={`page-${i}`}
                    doc={doc}
                    rotation={rotation}
                    scale={scale}
                    zoom={zoom}
                    containerHeight={containerHeight}
                    pageNumber={i+1}
                  />
                ))
              }
            </div>

            <div className="toolbar">
              <i
                className="fa fa-rotate-right"
                onClick={() => this.rotate()}
              />

              {
                zoom !== null &&
                <span>
                  Zoom: {(zoom+1) * 100}%
                </span>
              }

              <i
                className="fa fa-plus-circle"
                onClick={() => this.zoomIn()}
              />

              <i
                className="fa fa-minus-circle"
                onClick={() => this.zoomOut()}
              />

              <i
                className="fa fa-arrows-alt"
                onClick={() => this.fitWindow()}
              />
            </div>
          </div>
        }
      </div>
    )
  }
}

export default PdfViewer
