import React from 'react'
import { connect } from 'react-redux'
import cn from 'classnames'
import _ from 'underscore'
import { addNotification as notify } from 'reapop'
import PageThumbnail from './page/thumbnail'
import PageSelector from './page/selector'
import {
  selectSplitterPage,
  setSplitterPdfObject,
  resetSplitter
} from '../../../../../store_actions/deals'
import importPdfJs from '../../../../../utils/import-pdf-js'

class PDF extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    setTimeout(() => this.initialize(), 1300)
  }

  async initialize() {
    const { notify } = this.props

    const PDFJS = await importPdfJs()
    const { splitter, setSplitterPdfObject, resetSplitter } = this.props

    let invalidFilesCount = 0

    _.each(splitter.files, async pdf => {
      const url = pdf.file.preview || pdf.file.url

      try {
        const doc = await PDFJS.getDocument(url)

        setSplitterPdfObject(pdf.id, doc)
      } catch (e) {
        invalidFilesCount += 1

        const message =
          e.name === 'PasswordException'
            ? `Sorry "${pdf.file.name}" is password protected.`
            : `Sorry we can't open "${
                pdf.file.name
              }". it's damaged or not readable. ${e.message}`

        notify({
          title: 'Cannot open pdf file',
          message,
          status: 'warning'
        })

        if (invalidFilesCount === _.size(splitter.files)) {
          resetSplitter()
        }
      }
    })
  }

  onSelectPage(pageNumber, pdfId) {
    this.props.selectSplitterPage(pdfId, pageNumber)
  }

  render() {
    const { splitter } = this.props
    const { files, pdfObjects, pages, usedPages } = splitter

    return (
      <div>
        {_.size(pdfObjects) === 0 && (
          <div className="loading">
            <img
              src="/static/images/loading-states/three-dots-blue.svg"
              alt=""
            />
            <p>Loading Documents</p>
          </div>
        )}

        {_.map(pdfObjects, (doc, id) => (
          <div key={id} className="pdf-section">
            <div className="heading">
              <span className="page-title">{files[id].properties.name}</span>

              <span className="pages-count">
                ({doc.pdfInfo.numPages} pages)
              </span>
            </div>

            <PageSelector pdfId={id} numPages={doc.pdfInfo.numPages} />

            {Array.apply(null, { length: doc.pdfInfo.numPages }).map((v, i) => {
              const pageId = `${id}_${i + 1}`
              const inUse = typeof pages[pageId] !== 'undefined'
              const isUsed = typeof usedPages[pageId] !== 'undefined'

              return (
                <PageThumbnail
                  key={`page-${i}`}
                  inUse={inUse}
                  canvasClassName={cn({ inUse })}
                  pdfId={id}
                  doc={doc}
                  pageNumber={i + 1}
                >
                  {isUsed && <span className="page-cta is-used">Used</span>}

                  {inUse ? (
                    <span className="page-cta inuse">In Use</span>
                  ) : (
                    <span
                      className="page-cta"
                      onClick={() => this.onSelectPage(i + 1, id)}
                    >
                      Add page
                    </span>
                  )}
                </PageThumbnail>
              )
            })}
          </div>
        ))}
      </div>
    )
  }
}

function mapStateToProps({ deals }) {
  return {
    splitter: deals.splitter
  }
}

export default connect(mapStateToProps, {
  selectSplitterPage,
  setSplitterPdfObject,
  notify,
  resetSplitter
})(PDF)
