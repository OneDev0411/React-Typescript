import React from 'react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import { Field, reduxForm } from 'redux-form'
import withHandlers from 'recompose/withHandlers'

import Brand from '../../../../../../../controllers/Brand'
import { getStatusColor } from '../../../../../../../utils/listing'

import Schools from './Schools'
import Counties from './Counties'
import YearBuilt from './YearBuilt'
import NumberRange from './NumberRange'
import Subdivision from './Subdivision'
import MlsAreaSelects from './MlsAreaSelects'
import PropertySubtypes from './PropertySubtypes'
import GroupRadios from './components/GroupRadios'
import ArchitecturalStyles from './ArchitecturalStyles'
import SubStatuses from './components/SubStatuses'
import SoldStatusChildrens from './SoldStatusChildrens'
import { activeStatuses, otherStatuses } from './statuses'
import FiltersListingsStatusRow from './FiltersListingsStatusRow'
import actions from '../../../../../../../store_actions/listings/search/filters'

const property_subtypes = {
  condo: 'RES-Condo',
  farm: 'RES-Farm/Ranch',
  duplex: 'RES-Half Duplex',
  townhouse: 'RES-Townhouse',
  single_family: 'RES-Single Family'
}

const Filters = ({
  isOpen,
  pristine,
  submitting,
  activeSold,
  handleSubmit,
  onSubmitHandler,
  activeOpenHouses,
  activeOtherListings,
  activeActiveListings
}) => (
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
            isField
            hasSwitchToggle
            color={`#${getStatusColor('Sold')}`}
            onChangeSwitchToggle={activeSold}
          >
            <SoldStatusChildrens name="minimum_sold_date" />
          </FiltersListingsStatusRow>

          <FiltersListingsStatusRow
            title="Active"
            hasAccordion
            hasSwitchToggle
            name="active-statuses"
            fields={activeStatuses}
            color={`#${getStatusColor('Active')}`}
            onChangeSwitchToggle={activeActiveListings}
          >
            <SubStatuses fields={activeStatuses} />
          </FiltersListingsStatusRow>

          <FiltersListingsStatusRow
            name="open_house"
            title="Open House Only"
            icon="OH"
            isField
            hasSwitchToggle
            color={`#${getStatusColor('Active')}`}
            onChangeSwitchToggle={activeOpenHouses}
          />

          <FiltersListingsStatusRow
            title="Other Listing Statuses"
            hasAccordion
            hasSwitchToggle
            name="other-statuses"
            fields={otherStatuses}
            color={`#${getStatusColor('Pending')}`}
            onChangeSwitchToggle={activeOtherListings}
          >
            <SubStatuses fields={otherStatuses} />
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
          <NumberRange name="lot_square_meters" label="Lot Size Area (Foot)" />
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
)

export default compose(
  connect(null, { ...actions }),
  reduxForm({
    form: 'filters',
    destroyOnUnmount: false,
    initialValues: {
      pool: 'either',
      open_house: false,
      listing_statuses: {
        ...activeStatuses
      },
      property_subtypes,
      minimum_sold_date: '3', // unit is month but it need to timestamp
      minimum_bedrooms: 'any',
      minimum_bathrooms: 'any',
      minimum_parking_spaces: 'any'
    }
  }),
  withHandlers({
    onSubmitHandler: ({ submitFiltersForm }) => values => {
      submitFiltersForm(values)
    }
  })
)(Filters)
