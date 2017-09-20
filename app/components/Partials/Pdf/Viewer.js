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
      pageNumber: 1
    }
  }

  componentDidMount() {
    const { uri } = this.props
    this.mounted = true

    if (uri)
      this.load(uri)
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
      pageNumber: 1
    })

    try {
      const doc = await PDFJS.getDocument(uri)

      // trigger when load is completed
      if (!this.mounted)
        return false

      // set states
      this.setState({ doc, loading: false })

      // trigger onLoaded event
      this.props.onLoad()

    } catch (e) {
      this.setState({ uri: null, loading: false })
    }
  }

  prevPage() {
    const { pageNumber } = this.state

    if (pageNumber > 1)
      this.setState({ pageNumber: pageNumber - 1 })
  }

  nextPage() {
    const { pageNumber, doc } = this.state

    if (pageNumber < doc.pdfInfo.numPages)
      this.setState({ pageNumber: pageNumber + 1 })
  }

  render() {
    const { doc, pageNumber, loading } = this.state
    const { scale } = this.props

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
            <Page
              doc={doc}
              scale={scale}
              pageNumber={pageNumber}
            />

            <div className="pagination">
              <i
                className="left fa fa-chevron-circle-left fa-2x"
                onClick={this.prevPage.bind(this)}
              />
              <span className="pnum">{ pageNumber } / { doc.pdfInfo.numPages }</span>
              <i
                className="right fa fa-chevron-circle-right fa-2x"
                onClick={this.nextPage.bind(this)}
              />
            </div>
          </div>
        }
      </div>
    )
  }
}

export default PdfViewer
