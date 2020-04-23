import React from 'react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import { reduxForm } from 'redux-form'
import withHandlers from 'recompose/withHandlers'
import ClickOutside from 'react-click-outside'

import { getStatusColor } from 'utils/listing'
import actions from 'actions/listings/search/filters'
import ActionButton from 'components/Button/ActionButton'

import { property_subtypes, architectural_styles } from '../../../mapOptions'

import Price from './Price'
import Schools from './Schools'
import Counties from './Counties'
import YearBuilt from './YearBuilt'
import Tags from './components/Tags'
import Subdivision from './Subdivision'
import MasterBedroom from './MasterBedroom'
import MlsAreaSelects from './MlsAreaSelects'
import GroupRadios from './components/GroupRadios'
import SubStatuses from './components/SubStatuses'
import MinMaxInputs from './components/MinMaxInputs'
import SoldStatusChildrens from './SoldStatusChildrens'
import { pendingStatuses, otherStatuses } from './statuses'
import FiltersListingsStatusRow from './FiltersListingsStatusRow'
import { yesNoEitherFieldItems } from './helpers/yes-no-either-field-items'

const INITIAL_VALUES = {
  pool: 'either',
  open_house: false,
  listing_statuses: {
    active: 'Active'
  },
  property_subtypes,
  minimum_sold_date: '3', // unit is month but it need to timestamp
  priceZeroCleaner: false,
  minimum_bedrooms: 'any',
  minimum_bathrooms: 'any',
  minimum_parking_spaces: 'any'
}

const Filters = ({
  resetHandler,
  pristine,
  activeSold,
  handleClose,
  handleSubmit,
  isSubmitting,
  onSubmitHandler,
  activeOpenHouses,
  activeOtherListings,
  activePendingListings
}) => (
  <ClickOutside onClickOutside={handleClose}>
    <div className="c-filters">
      <div className="c-filters__inner-wrapper u-scrollbar--thinner">
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
              name="listing_statuses.active"
              title="Active"
              isField
              hasSwitchToggle
              color={`#${getStatusColor('Active')}`}
            />

            <FiltersListingsStatusRow
              title="Pending"
              hasAccordion
              hasSwitchToggle
              name="pending-statuses"
              fields={pendingStatuses}
              color={`#${getStatusColor('Pending')}`}
              onChangeSwitchToggle={activePendingListings}
            >
              <SubStatuses fields={pendingStatuses} />
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
              color={`#${getStatusColor('Sold')}`}
              onChangeSwitchToggle={activeOtherListings}
            >
              <SubStatuses fields={otherStatuses} />
            </FiltersListingsStatusRow>
          </div>
          <div style={{ padding: '2rem 1rem 5rem', backgroundColor: '#fff' }}>
            <MlsAreaSelects />
            <Counties />
            <Price />
            <Tags
              name="property_subtypes"
              label="Property Subtypes"
              fields={property_subtypes}
            />
            <Tags
              label="Style of Home"
              name="architectural_styles"
              fields={architectural_styles}
            />
            <GroupRadios name="minimum_bedrooms" label="Bedrooms" />
            <MasterBedroom />
            <GroupRadios name="minimum_bathrooms" label="Bathrooms" />
            <GroupRadios name="minimum_parking_spaces" label="Parking Spaces" />
            <Subdivision />
            <Schools />
            <MinMaxInputs name="square_meters" label="Square Footage" />
            <MinMaxInputs
              name="lot_square_meters"
              label="Lot Size Area (Acre)"
            />
            <GroupRadios
              label="Pool"
              name="pool"
              fields={yesNoEitherFieldItems}
            />
            <YearBuilt />
          </div>
        </form>
        <div className="c-filters__form-cta-buttons">
          <ActionButton
            size="large"
            style={{ marginRight: '1rem' }}
            appearance="outline"
            onClick={resetHandler}
            disabled={isSubmitting || pristine}
          >
            Reset Filters
          </ActionButton>
          <ActionButton
            appearance="secondary"
            size="large"
            disabled={isSubmitting}
            onClick={handleSubmit(onSubmitHandler)}
          >
            {isSubmitting ? 'Updating...' : 'Update Filters'}
          </ActionButton>
        </div>
      </div>
    </div>
  </ClickOutside>
)

export default compose(
  connect(
    ({ user }) => {
      const priceZeroCleaner = user && user.user_type === 'Agent'

      return {
        initialValues: {
          ...INITIAL_VALUES,
          priceZeroCleaner
        }
      }
    },
    { ...actions }
  ),
  reduxForm({
    form: 'filters',
    destroyOnUnmount: false
  }),
  withHandlers({
    onSubmitHandler: ({ submitFiltersForm }) => values => {
      submitFiltersForm(values)
    }
  }),
  withHandlers({
    resetHandler: ({
      reset,
      initialValues,
      submitFiltersForm,
      submitSucceeded,
      submitFailed
    }) => () => {
      if (submitSucceeded || submitFailed) {
        reset()
        submitFiltersForm(initialValues)
      } else {
        reset()
      }
    }
  })
)(Filters)
