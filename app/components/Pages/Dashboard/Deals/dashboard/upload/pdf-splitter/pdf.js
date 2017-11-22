import React from 'react'
import { connect } from 'react-redux'
import cn from 'classnames'
import _ from 'underscore'
import Page from './page'
import { setSplitterDocument, setSplitterPage } from '../../../../../../../store_actions/deals'

class PDF extends React.Component {
  constructor(props) {
    super(props)
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
      this.props.setSplitterDocument(pdf.id, doc)
    })
  }

  onSelectPage(pageNumber, pdfId) {
    this.props.setSplitterPage(pdfId, pageNumber)
  }

  render() {
    const { splitter, upload } = this.props

    return (
      <div>
        {
          _.map(splitter.documents, (doc, id) =>
            <div
              key={`pdf-${id}`}
              className="pdf-section"
            >

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
                    pdfId={id}
                    doc={doc}
                    pageNumber={i + 1}
                  >
                    {
                      splitter.pages[`${id}_${i+1}`] ?
                      <span className="page-cta inuse">In Use</span> :
                      <span
                        className="page-cta"
                        onClick={() => this.onSelectPage(i + 1, id)}
                      >
                        Add page
                      </span>
                    }
                  </Page>
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
    splitter: deals.splitter,
    upload: deals.upload
  }
}

export default connect(mapStateToProps, { setSplitterPage, setSplitterDocument })(PDF)
