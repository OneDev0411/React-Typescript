import React from 'react'
import { connect } from 'react-redux'
import cn from 'classnames'
import _ from 'underscore'
import Page from './page'

class PDF extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      documents: {}
    }
  }

  async componentDidMount() {
    const { upload } = this.props
    const pdfs = _.filter(upload.files, file => file.fileObject.type === 'application/pdf')

    if (pdfs.length === 0) {
      return false
    }

    // lazy load
    await import('pdfjs-dist/build/pdf.combined' /* webpackChunkName: "pdf.combined" */ )
    await import('pdfjs-dist/web/compatibility' /* webpackChunkName: "pdf.comp" */)

    pdfs.forEach(async pdf => {
      const doc = await PDFJS.getDocument(pdf.fileObject.preview)

      this.setState({
        documents: {
          ...this.state.documents,
          [pdf.id]: doc
        }
      })
    })
  }

  render() {
    const { documents } = this.state
    const { upload } = this.props

    // console.log(documents)
    return (
      <div>
        {
          _.map(documents, (doc, id) =>
            <div className="pdf-section">

              <div className="heading">
                <span className="page-title">
                  { upload.files[id].fileObject.name }
                </span>

                <span className="pages-count">
                  ({ doc.pdfInfo.numPages } page)
                </span>
              </div>

              {
                Array.apply(null, { length: doc.pdfInfo.numPages })
                .map((v, i) => (
                  <Page
                    key={`page-${i}`}
                    doc={doc}
                    pageNumber={i + 1}
                  />
                ))
              }
            </div>
          )
        }
      </div>
    )
  }
}

function mapStateToProps({ deals }) {
  return {
    upload: deals.upload
  }
}

export default connect(mapStateToProps)(PDF)
