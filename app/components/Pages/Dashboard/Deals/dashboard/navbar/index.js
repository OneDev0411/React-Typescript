import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { showAttachments } from '../../../../../../store_actions/deals'
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
    const { deal } = this.props

    browserHistory.push(`/dashboard/deals/${deal.id}/files`)
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
              View & Upload Files
            </button>

            <button className="navbar-button" onClick={() => this.getSignatures()}>
              Get Signatures
            </button>

            {!isBackOffice && <BulkSubmit deal={deal} />}
          </div>
        )}
      </div>
    )
  }
}

export default connect(
  ({ deals }) => ({
    isBackOffice: deals.backoffice
  }),
  { showAttachments }
)(NavBar)
