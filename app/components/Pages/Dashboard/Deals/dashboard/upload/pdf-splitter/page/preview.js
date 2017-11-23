import React from 'react'
import { connect } from 'react-redux'
import cn from 'classnames'
import { setPagePreview } from '../../../../../../../../store_actions/deals'
import Page from '.'

class PageZoom extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    console.log('>>>>')
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
          ONE TO FOUR FAMILY

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
    splitter: deals.splitter
  }
}

export default connect(mapStateToProps, { setPagePreview })(PageZoom)
