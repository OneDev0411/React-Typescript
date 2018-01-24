import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import Dropzone from 'react-dropzone'
import {
  showAttachments,
  setUploadFiles
} from '../../../../../../store_actions/deals'
import Deal from '../../../../../../models/Deal'
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
    const { deal, isBackOffice } = this.props

    return (
      <div className="deal-navbar">
        <div className="back" onClick={() => this.goBack()}>
          <i className="fa fa-chevron-left" />
          Deals
        </div>

        {deal.checklists && (
          <div className="ctas">
            {deal.deal_type === 'Selling' && (
              <button
                className="navbar-button"
                onClick={() =>
                  browserHistory.push(`/dashboard/deals/${deal.id}/create-offer`)
                }
              >
                Add New Offer
              </button>
            )}
            <button
              className="navbar-button"
              onClick={() => this.openUploadDialog()}
            >
              Upload
            </button>

            <button className="navbar-button" onClick={() => this.getSignatures()}>
              Get Signatures
            </button>

            {!isBackOffice && <BulkSubmit deal={deal} />}
          </div>
        )}

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

export default connect(
  ({ deals }) => ({
    isBackOffice: deals.backoffice
  }),
  {
    showAttachments,
    setUploadFiles
  }
)(NavBar)
