import React from 'react'
import { connect } from 'react-redux'
import cn from 'classnames'
import { setPagePreview } from '../../../../../../../../store_actions/deals'
import Page from '.'

class PagePreview extends React.Component {
  constructor(props) {
    super(props)
  }

  closeModal() {
    this.props.setPagePreview(null)
  }

  render() {
    const { upload, splitter } = this.props
    const { pdfId, doc, pageNumber } = splitter.pagePreview

    return (
      <div className="page-preview">
        <div className="header">
          { upload.files[pdfId].fileObject.name}

          <span
            className="close"
            onClick={() => this.closeModal()}
          >
            X
          </span>
        </div>

        <div
          className="preview"
          ref={ref => this.previewContainer = ref}
        >
          <Page
            containerHeight={320}
            pdfId={pdfId}
            doc={doc}
            pageNumber={pageNumber}
          />
        </div>
      </div>
    )
  }

}

function mapStateToProps({ deals }) {
  return {
    upload: deals.upload,
    splitter: deals.splitter
  }
}

export default connect(mapStateToProps, { setPagePreview })(PagePreview)
