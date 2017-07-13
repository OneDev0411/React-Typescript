import React from 'react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import { Field, reduxForm } from 'redux-form'
import withHandlers from 'recompose/withHandlers'

import Brand from '../../../../../../../controllers/Brand'

import Schools from './Schools'
import Counties from './Counties'
import YearBuilt from './YearBuilt'
import NumberRange from './NumberRange'
import Subdivision from './Subdivision'
import MlsAreaSelects from './MlsAreaSelects'
import PropertySubtypes from './PropertySubtypes'
import GroupRadios from './components/GroupRadios'
import ArchitecturalStyles from './ArchitecturalStyles'
import SoldStatusChildrens from './SoldStatusChildrens'
import OtherStatusesChildrens from './OtherStatusesChildrens'
import FiltersListingsStatusRow from './FiltersListingsStatusRow'
import actions from '../../../../../../../store_actions/listings/search/filters'

const property_subtypes = {
  condo: 'RES-Condo',
  farm: 'RES-Farm/Ranch',
  duplex: 'RES-Half Duplex',
  townhouse: 'RES-Townhouse',
  single_family: 'RES-Single Family'
}

const otherStatuses = {
  canclled: 'Canclled',
  expired: 'Expired',
  contingent: 'Contingent',
  kick_out: 'Kick Out',
  option_contract: 'Option Contract',
  pending: 'Pending',
  temp_off_market: 'Temp Off Market',
  withdrawn: 'Withdrawn',
  withdrawn_sublistin: 'Withdrawn Sublisting'
}

const Filters = ({
  isOpen,
  pristine,
  submitting,
  activeSold,
  handleSubmit,
  onSubmitHandler,
  activeOpenHouses,
  activeActiveListings
}) =>
  <div className={`c-filters ${isOpen ? 'c-filters--isOpen' : ''}`}>
    <div className="c-filters__inner-wrapper">
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className="c-filters__content"
      >
        <div>
          <FiltersListingsStatusRow
            name="listing_statuses.sold"
            title="Sold"
            hasAccordion
            hasSwitchToggle
            color="#d00023"
            onChangeSwitchToggle={activeSold}
          >
            <SoldStatusChildrens name="minimum_sold_date" />
          </FiltersListingsStatusRow>

          <FiltersListingsStatusRow
            name="listing_statuses.active"
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
            name="listing_statuses"
            title="Other Listing Statuses"
            hasAccordion
            color="#f5a544"
          >
            <OtherStatusesChildrens
              name="listing_statuses"
              fields={otherStatuses}
            />
          </FiltersListingsStatusRow>
        </div>
        <div style={{ padding: '3rem 2rem 6rem', backgroundColor: '#fff' }}>
          <MlsAreaSelects />
          <Counties />
          <NumberRange name="price" placeholder="$Any" label="Price Range" />
          <PropertySubtypes fields={property_subtypes} />
          <ArchitecturalStyles />
          <GroupRadios name="minimum_bedrooms" label="Bedrooms" />
          <GroupRadios name="minimum_bathrooms" label="Bathrooms" />
          <GroupRadios name="minimum_parking_spaces" label="Garage Space" />
          <Subdivision />
          <Schools />
          <NumberRange name="square_meters" label="Square Footage" />
          <NumberRange name="lot_square_meters" label="Lot Square Footage" />
          <GroupRadios
            label="Pool"
            name="pool"
            fields={[
              { title: 'Yes', value: 'YES' },
              { title: 'No', value: 'NO' },
              { title: 'Either', value: 'either' }
            ]}
          />
          <YearBuilt />
        </div>
      </form>
      <button
        onClick={handleSubmit(onSubmitHandler)}
        className="c-filters__submit-btn"
        disabled={submitting}
        style={{ background: `#${Brand.color('primary', '#2196f3')}` }}
      >
        Update Filters
      </button>
    </div>
  </div>

export default compose(
  connect(null, { ...actions }),
  reduxForm({
    form: 'filters',
    destroyOnUnmount: false,
    initialValues: {
      pool: 'either',
      open_house: false,
      listing_statuses: {
        active: 'Active'
      },
      property_subtypes,
      minimum_sold_date: '3', // unit is month but it need to timestamp
      minimum_bedrooms: 'any',
      minimum_bathrooms: 'any',
      minimum_parking_spaces: 'any'
    },
    getFormState: ({ search }) => search.filters.form
  }),
  withHandlers({
    onSubmitHandler: ({ submitFiltersForm }) => values => {
      submitFiltersForm(values)
    }
  })
)(Filters)
