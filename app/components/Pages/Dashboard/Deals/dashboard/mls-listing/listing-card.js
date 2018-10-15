import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import cn from 'classnames'
import _ from 'underscore'
import { browserHistory } from 'react-router'
import Tooltip from '../../../../../../views/components/tooltip/index'
import ManualAddress from '../../components/address'
import Deal from '../../../../../../models/Deal'
import { updateContext } from '../../../../../../store_actions/deals'
import LinkButton from 'components/Button/LinkButton'

class ListingCard extends React.Component {
  state = {
    isSavingAddress: false,
    showAddressModal: false
  }

  openListing = deal => {
    if (deal.listing) {
      browserHistory.push(`/dashboard/mls/${deal.listing}`)
    }
  }

  toggleShowAddressModal = () =>
    this.setState({
      showAddressModal: !this.state.showAddressModal
    })

  render() {
    const { deal, roles } = this.props
    const { showAddressModal, isSavingAddress } = this.state
    const photo = Deal.get.field(deal, 'photo')

    return (
      <div className="deal-listing-card">
        <button
          className={cn('c-button--shadow listing-photo', {
            hasListing: deal.listing
          })}
          onClick={() => this.openListing(deal)}
        >
          <img alt="" src={photo || '/static/images/deals/group-146.svg'} />
          <span className="view-btn">VIEW</span>
        </button>

        <div className="address-info">
          <Tooltip
            captionIsHTML
            isCustom={false}
            caption={
              deal.listing && (
                <React.Fragment>
                  <img src="/static/images/deals/lock.svg" alt="locked" />
                  <div>
                    Listing information can only be changed on MLS. Once
                    changed, the update will be reflected here.
                  </div>
                </React.Fragment>
              )
            }
            placement="bottom"
            multiline
          >
            <div
              className={cn('deal-listing-card__address', {
                'is-editable': !deal.listing && !isSavingAddress
              })}
              onClick={() =>
                !deal.listing &&
                !isSavingAddress &&
                this.toggleShowAddressModal()
              }
            >
              {isSavingAddress ? (
                <i className="fa fa-spin fa-spinner" />
              ) : (
                <div className="deal-listing-card__address__text">
                  {Deal.get.address(deal, roles)}
                </div>
              )}
            </div>
          </Tooltip>

          {deal.listing && (
            <LinkButton
              appearance="link"
              size="small"
              to={`/dashboard/mls/${deal.listing}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                className="deal-listing-card__open-link-icon"
                fill="#C9D7DF"
                fillRule="evenodd"
              >
                <path d="M14 16c1.103 0 2-.897 2-2v-4h-2v4H2V2h4V0H2C.897 0 0 .897 0 2v12c0 1.103.897 2 2 2h12z" />
                <path d="M9 2h3.586L5.293 9.293l1.414 1.414L14 3.414V7h2V0H9z" />
              </svg>
            </LinkButton>
          )}
        </div>

        <ManualAddress
          show={showAddressModal}
          deal={deal}
          onClose={this.toggleShowAddressModal}
        />
      </div>
    )
  }
}

function mapToProps({ deals }) {
  const { contexts, roles, backoffice: isBackOffice } = deals

  return {
    roles,
    contexts,
    isBackOffice
  }
}

export default connect(
  mapToProps,
  { updateContext }
)(ListingCard)
