import React from 'react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import { Field, reduxForm } from 'redux-form'
import withHandlers from 'recompose/withHandlers'

import Brand from '../../../../../../../controllers/Brand'
import SoldStatusChildrens from './SoldStatusChildrens'
import OtherStatusesChildrens from './OtherStatusesChildrens'
import FiltersListingsStatusRow from './FiltersListingsStatusRow'
import actions from '../../../../../../../store_actions/listings/search/filters'

const Filters = ({
  isOpen,
  pristine,
  submitting,
  activeSold,
  handleSubmit,
  activeOpenHouses,
  activeActiveListings
}) =>
  <div className={`c-filters ${isOpen ? 'c-filters--isOpen' : ''}`}>
    <div className="c-filters__inner-wrapper">
      <form onSubmit={handleSubmit} className="c-filters__content">
        <FiltersListingsStatusRow
          name="soldListings"
          title="Sold"
          hasAccordion
          hasSwitchToggle
          color="#d00023"
          onChangeSwitchToggle={activeSold}>
          <SoldStatusChildrens name="soldListingsDate" />
        </FiltersListingsStatusRow>

        <FiltersListingsStatusRow
          name="activeListings"
          title="Active"
          color="#32b86d"
          hasSwitchToggle
          onChangeSwitchToggle={activeActiveListings}
        />

        <FiltersListingsStatusRow
          name="open_house"
          title="Open House Only"
          icon="OH"
          hasSwitchToggle
          color="#32b86d"
          onChangeSwitchToggle={activeOpenHouses}
        />

        <FiltersListingsStatusRow
          name="otherListingStatuses"
          title="Other Listing Statuses"
          hasAccordion
          color="#f5a544">
          <OtherStatusesChildrens name="otherListingStatuses" />
        </FiltersListingsStatusRow>
      </form>
      <button
        onClick={handleSubmit}
        className="c-filters__submit-btn"
        disabled={pristine || submitting}
        style={{ backgroundColor: `#${Brand.color('primary', '#2196f3')}` }}>
        Update Filters
      </button>
    </div>
  </div>

export default compose(
  connect(null, { ...actions }),
  reduxForm({
    form: 'filters',
    initialValues: {
      soldListings: false,
      soldListingsDate: 'lastThreeMonth',
      activeListings: true,
      otherListingStatuses: {
        canclled: false,
        expired: false,
        contingent: false,
        kickOut: false,
        optionContract: false,
        pending: false,
        tempOffMarket: false,
        withdrawn: false,
        withdrawnSublisting: false
      },
      open_house: false
    },
    getFormState: ({ search }) => search.filters.form
  })
)(Filters)
