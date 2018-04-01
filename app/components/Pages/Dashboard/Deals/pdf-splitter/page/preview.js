import React from 'react'
import { connect } from 'react-redux'
import { setPagePreview } from '../../../../../../store_actions/deals'
// import Page from '.'
import PdfViewer from '../../../../../Partials/Pdf/Viewer'

class PagePreview extends React.Component {
  constructor(props) {
    super(props)
  }

  closeModal() {
    this.props.setPagePreview(null)
  }

  onLoad() {
    const { splitter } = this.props
    const { pageNumber } = splitter.pagePreview

    window.location.hash = `#p${pageNumber}`
  }

  render() {
    const { splitter } = this.props
    const { pdfId } = splitter.pagePreview
    const pdf = splitter.files[pdfId]

    return (
      <div className="page-preview">
        <div className="header">
          {pdf.properties.name || pdf.file.name}

          <span className="exit" onClick={() => this.closeModal()}>
            <i className="fa fa-times" />
          </span>
        </div>

        <div className="preview">
          <PdfViewer
            uri={pdf.file.url || pdf.file.preview}
            defaultContainerHeight="85vh"
            onLoad={() => this.onLoad()}
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
