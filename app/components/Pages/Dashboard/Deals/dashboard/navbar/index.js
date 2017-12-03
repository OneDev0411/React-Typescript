import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import Dropzone from 'react-dropzone'
import { showAttachments, setUploadFiles } from '../../../../../../store_actions/deals'
import BulkSubmit from '../bulk-submit'

class NavBar extends React.Component {
  constructor(props) {
    super(props)
  }

  goBack() {
    browserHistory.push('/dashboard/deals')
  }

  getSignatures() {
    this.props.showAttachments()
  }

  openUploadDialog() {
    this.dropzone.open()
  }

  onDrop(files) {
    const { deal } = this.props
    this.props.setUploadFiles(files, deal, null)
  }

  render() {
    const { deal } = this.props

    return (
      <div className="deal-navbar">
        <div
          className="back"
          onClick={() => this.goBack()}
        >
          <i className="fa fa-chevron-left" />
          Deals
        </div>

        <div className="ctas">
          <button
            className="btn-deal"
            onClick={() => this.openUploadDialog()}
          >
            Upload
          </button>

          <button
            className="btn-deal"
            onClick={() => this.getSignatures()}
          >
            Get Signatures
          </button>

          <BulkSubmit
            deal={deal}
          />
        </div>

         <Dropzone
          disableClick
          ref={(node) => this.dropzone = node}
          onDrop={(files) => this.onDrop(files)}
          multiple={true}
          accept="application/pdf,image/*"
          style={{ display: 'none' }}
        />
      </div>
    )
  }
}

export default connect(null, {
  showAttachments,
  setUploadFiles
})(NavBar)
