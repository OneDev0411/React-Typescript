import React from 'react'
import { connect } from 'react-redux'
import cn from 'classnames'
import _ from 'underscore'
import { DragDropContextProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import PDFList from './pdf-list'
import PagePreview from './page/preview'
import Workspace from './workspace'
import { resetSplitter } from '../../../../../../../store_actions/deals'
import { confirmation } from '../../../../../../../store_actions/confirmation'


class PDFSplitter extends React.Component {
  constructor(props) {
    super(props)
  }

  closeSplitter() {
    const { splitter, confirmation, resetSplitter } = this.props

    if (_.size(splitter.pages) === 0) {
      return resetSplitter()
    }

    confirmation({
      message: 'Wait! Are you sure ?',
      description: 'You have unsaved changes.',
      confirmLabel: 'Yes',
      cancelLabel: 'No',
      onConfirm: () => resetSplitter()
    })
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
            onClick={() => this.closeSplitter()}
            className="close-form"
          >
            <i className="fa fa-times" />
          </span>
        </div>

        {
          splitter.pagePreview &&
          <PagePreview />
        }

        <DragDropContextProvider backend={HTML5Backend}>
          <div className="splitter-container">
            <div
              className="pdfs"
              ref={ref => this.pdfsContainer = ref}
            >
              <PDFList />
            </div>

            <div
              className="workspace"
              ref={ref => this.workspaceContainer = ref}
            >
              <Workspace />
            </div>
          </div>
        </DragDropContextProvider>
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

export default connect(mapStateToProps, {
  resetSplitter,
  confirmation
})(PDFSplitter)
