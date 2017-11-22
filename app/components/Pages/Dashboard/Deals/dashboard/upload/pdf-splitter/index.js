import React from 'react'
import { connect } from 'react-redux'
import cn from 'classnames'
import PDFS from './pdf'
import Workspace from './workspace'
import { displaySplitter } from '../../../../../../../store_actions/deals'

class PDFSplitter extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { splitter, upload } = this.props

    if (splitter.display !== true) {
      return false
    }

    return (
      <div className="pdf-splitter">
        <div className="header">
          <span>Split</span>
          <span
            onClick={() => this.props.displaySplitter(false)}
            className="close-form"
          >
            X
          </span>
        </div>

        <div className="splitter-container">
          <div className="pdfs">
            <PDFS />
          </div>

          <div className="workspace">
            <Workspace />
          </div>
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

export default connect(mapStateToProps, { displaySplitter })(PDFSplitter)
