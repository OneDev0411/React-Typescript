import React from 'react'
import { connect } from 'react-redux'
import cn from 'classnames'
import _ from 'underscore'
import PageThumbnail from './page/thumbnail'
import { setSplitterDocument, selectSplitterPage } from '../../../../../../../store_actions/deals'

const STATUS_UPLOADING = 'uploading'
const STATUS_UPLOADED = 'uploaded'

class PDF extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    setTimeout(() => this.initialize(), 1300)
  }

  async initialize() {
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
    this.props.selectSplitterPage(pdfId, pageNumber)
  }

  render() {
    const { splitter, upload } = this.props

    return (
      <div>
        {
          _.size(splitter.documents) === 0 &&
          <div className="loading">
            <img src="/static/images/loading-states/three-dots-blue.svg" />
            <p>Loading Documents</p>
          </div>
        }

        {
          _.chain(splitter.documents)
          .filter((doc, id) => {
            // set doc id
            doc.id = id
            return true
            // set status
            // const { status } = upload.files[id].properties
            // return status !== STATUS_UPLOADED && status !== STATUS_UPLOADING
          })
          .map((doc) =>
            <div
              key={`pdf-${doc.id}`}
              className="pdf-section"
            >

              <div className="heading">
                <span className="page-title">
                  { upload.files[doc.id].fileObject.name }
                </span>

                <span className="pages-count">
                  ({ doc.pdfInfo.numPages } page)
                </span>
              </div>

              {
                Array.apply(null, { length: doc.pdfInfo.numPages })
                .map((v, i) => {
                  const inUse = typeof splitter.pages[`${doc.id}_${i+1}`] !== 'undefined'

                  return (
                    <PageThumbnail
                      key={`page-${i}`}
                      inUse={inUse}
                      canvasClassName={cn({ inUse })}
                      pdfId={doc.id}
                      doc={doc}
                      pageNumber={i + 1}
                    >
                      {
                        inUse ?
                        <span className="page-cta inuse">In Use</span> :
                        <span
                          className="page-cta"
                          onClick={() => this.onSelectPage(i + 1, doc.id)}
                        >
                          Add page
                        </span>
                      }
                    </PageThumbnail>
                  )
                })
              }
            </div>
          )
          .value()
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

export default connect(mapStateToProps, { selectSplitterPage, setSplitterDocument })(PDF)
