import React from 'react'
import { connect } from 'react-redux'
import cn from 'classnames'
import _ from 'underscore'
import PageThumbnail from './page/thumbnail'
import PageSelector from './page/selector'
import {
  selectSplitterPage,
  setSplitterPdfObject
} from '../../../../../store_actions/deals'

class PDF extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    setTimeout(() => this.initialize(), 1300)
  }

  async initialize() {
    /* eslint-disable max-len */
    await import('pdfjs-dist/build/pdf.combined' /* webpackChunkName: "pdf.combined" */)

    /* eslint-disable max-len */
    await import('pdfjs-dist/web/compatibility' /* webpackChunkName: "pdf.comp" */)

    const { splitter, setSplitterPdfObject } = this.props

    _.each(splitter.files, async pdf => {
      const doc = await PDFJS.getDocument(pdf.file.preview)

      setSplitterPdfObject(pdf.id, doc)
    })
  }

  onSelectPage(pageNumber, pdfId) {
    this.props.selectSplitterPage(pdfId, pageNumber)
  }

  render() {
    const { splitter } = this.props
    const {
      files, pdfObjects, pages, usedPages
    } = splitter

    console.log(usedPages)

    return (
      <div>
        {_.size(pdfObjects) === 0 && (
          <div className="loading">
            <img src="/static/images/loading-states/three-dots-blue.svg" alt="" />
            <p>Loading Documents</p>
          </div>
        )}

        {_.map(pdfObjects, (doc, id) => (
          <div key={id} className="pdf-section">
            <div className="heading">
              <span className="page-title">{files[id].name}</span>

              <span className="pages-count">({doc.pdfInfo.numPages} pages)</span>
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
  setSplitterPdfObject
})(PDF)
