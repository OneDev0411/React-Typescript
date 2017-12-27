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
            className="exit"
            onClick={() => this.closeModal()}
          >
            <i className="fa fa-times" />
          </span>
        </div>

        <div className="preview">
          <Page
            containerHeight="95%"
            zoom={0.9}
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
