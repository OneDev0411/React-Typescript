import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { showAttachments } from '../../../../../../store_actions/deals'
import BulkSubmit from '../bulk-submit'
import DealEmail from '../../dashboard/deal-email'

class NavBar extends React.Component {
  constructor(props) {
    super(props)
  }

  getSignatures() {
    this.props.showAttachments()
  }

  render() {
    const { deal, isBackOffice } = this.props

    return (
      <div className="deal-navbar">
        <Link className="back" to="/dashboard/deals">
          <i className="fa fa-chevron-left" />
          Deals
        </Link>

        {deal.checklists && (
          <div className="ctas">
            <DealEmail dealEmail={deal.email} />
            {deal.deal_type === 'Selling' && (
              <Link
                className="navbar-button"
                to={`/dashboard/deals/${deal.id}/create-offer`}
              >
                Add New Offer
              </Link>
            )}

            <Link
              className="navbar-button"
              to={`/dashboard/deals/${deal.id}/files`}
            >
              View & Upload Files
            </Link>

            <button
              className="navbar-button"
              onClick={() => this.getSignatures()}
            >
              Get Signatures
            </button>

            {/* {!isBackOffice && <BulkSubmit deal={deal} />} */}
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
