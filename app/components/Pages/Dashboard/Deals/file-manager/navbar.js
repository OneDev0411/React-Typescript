import React, { Fragment } from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import Dropzone from 'react-dropzone'
import { setUploadFiles } from '../../../../../store_actions/deals'
import Deal from '../../../../../models/Deal'
import DealEmail from '../dashboard/deal-email'

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
    this.props.setUploadFiles(files, null)
  }

  render() {
    const { deal } = this.props

    return (
      <Fragment>
        <div className="deal-navbar">
          <div className="back" onClick={() => this.backToDeal()}>
            <i className="fa fa-chevron-left" />
            Document List
          </div>

          <div className="ctas">
            <DealEmail dealEmail={deal.email} />
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
      </Fragment>
    )
  }
}

export default connect(null, {
  setUploadFiles
})(FileManager)
