import React from 'react'
import _ from 'underscore'
import 'pdfjs-dist/build/pdf.combined'
import 'pdfjs-dist/web/compatibility'
import Page from './Page'

class PdfViewer extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      uri: null,
      loading: false,
      doc: null,
      pageNumber: 1
    }
  }

  componentDidMount () {
    const { uri } = this.props

    if (uri)
      this.load(uri)
  }

  componentWillReceiveProps(nextProps) {
    const { uri } = nextProps

    if (uri)
      this.load(uri)
  }

  async load(uri) {

    if (this.state.loading || uri === this.state.uri)
      return false

    this.setState({
      uri,
      loading: true,
      doc: null,
      pageNumber: 1
    })

    try {
      const doc = await PDFJS.getDocument(uri)
      this.setState({ doc, loading: false })
    }
    catch(e) {
      this.setState({ uri: null, loading: false })
    }
  }

  prevPage(){
    const { pageNumber } = this.state

    if (pageNumber > 1)
      this.setState({ pageNumber: pageNumber - 1 })
  }

  nextPage(){
    const { pageNumber, doc } = this.state

    if (pageNumber < doc.pdfInfo.numPages)
      this.setState({ pageNumber: pageNumber + 1 })
  }

  render () {
    const { doc, pageNumber, loading } = this.state

    return (
      <div>
        {
          loading &&
          <div className="loading center">
            <i className="fa fa-spinner fa-spin fa-2x fa-fw"></i>
            <p>Loading document</p>
          </div>
        }

        {
          doc && !loading &&
          <div className="pdf-context">
             <Page
              doc={ doc }
              scale={ this.props.scale }
              pageNumber={ pageNumber }
            />

            <div className="pagination">
              <i
                className="left fa fa-chevron-circle-left fa-2x"
                onClick={this.prevPage.bind(this)}
              ></i>
              <span className="pnum">{ pageNumber } / { doc.pdfInfo.numPages }</span>
              <i
                className="right fa fa-chevron-circle-right fa-2x"
                onClick={this.nextPage.bind(this)}
              ></i>
            </div>
          </div>
        }
      </div>
    )
  }
}

export default PdfViewer

