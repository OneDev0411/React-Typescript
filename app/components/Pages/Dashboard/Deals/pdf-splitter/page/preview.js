import React from 'react'
import { connect } from 'react-redux'
import { setPagePreview } from '../../../../../../store_actions/deals'
import Page from '.'

class PagePreview extends React.Component {
  constructor(props) {
    super(props)
  }

  closeModal() {
    this.props.setPagePreview(null)
  }

  render() {
    const { splitter } = this.props
    const { pdfId, doc, pageNumber } = splitter.pagePreview

    return (
      <div className="page-preview">
        <div className="header">
          {splitter.files[pdfId].name}

          <span className="exit" onClick={() => this.closeModal()}>
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
    splitter: deals.splitter
  }
}

export default connect(mapStateToProps, { setPagePreview })(PagePreview)
