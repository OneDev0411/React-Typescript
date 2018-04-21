import React from 'react'
import { connect } from 'react-redux'
import { setPagePreview } from '../../../../../../store_actions/deals'
import Page from '.'

const PageThumbnail = ({
  setPagePreview,
  inUse,
  canvasClassName,
  pageNumber,
  pdfId,
  doc,
  children,
  size = 'small'
}) => (
  <Page
    isDraggable
    inUse={inUse}
    containerHeight={size === 'small' ? 200 : '100%'}
    size={size}
    zoom={2}
    canvasClassName={canvasClassName}
    pdfId={pdfId}
    doc={doc}
    pageNumber={pageNumber}
  >
    {!inUse && <div className="overlay" />}

    <span
      className="page-zoom-in"
      onClick={() => setPagePreview({ pdfId, doc, pageNumber })}
    >
      <i className="fa fa-search" />
    </span>

    <span className="page-number">{pageNumber}</span>

    {children}
  </Page>
)

export default connect(null, { setPagePreview })(PageThumbnail)
