import React from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import Dropzone from 'react-dropzone'
import { setUploadFiles } from '../../../../../store_actions/deals'
import Deal from '../../../../../models/Deal'

export class FileManager extends React.Component {
  constructor(props) {
    super(props)
  }

  backToDeal() {
    const { deal } = this.props

    browserHistory.push(`/dashboard/deals/${deal.id}`)
  }

  openUploadDialog() {
    this.dropzone.open()
  }

  onDrop(files) {
    const { deal } = this.props

    this.props.setUploadFiles(files, deal, null)
  }

  render() {
    return (
      <div className="deal-dashboard u-scrollbar--thinner">
        <div className="deal-navbar">
          <div className="back" onClick={() => this.backToDeal()}>
            <i className="fa fa-chevron-left" />
            Document List
          </div>

          <div className="ctas">
            <button
              className="navbar-button"
              onClick={() => this.openUploadDialog()}
            >
              Upload
            </button>
          </div>
        </div>

        <Dropzone
          disableClick
          ref={node => (this.dropzone = node)}
          onDrop={files => this.onDrop(files)}
          multiple
          accept={Deal.upload.getAcceptedDocuments()}
          style={{ display: 'none' }}
        />
      </div>
    )
  }
}

export default connect(null, {
  setUploadFiles
})(FileManager)
