import React from 'react'

import FiltersListingsStatusRow from './FiltersListingsStatusRow'

const Filters = ({ isOpen }) =>
  <div className={`c-filters ${isOpen ? 'c-filters--isOpen' : ''}`}>
    <div className="c-filters__inner-wrapper">
      <div className="c-filters__content">
        <FiltersListingsStatusRow
          name="soldListings"
          title="Sold"
          color="#d00023"
          dropdownItems={{
            lastThreeMonth: {
              title: 'Last 3 Month',
              checked: true
            },
            lastSixMonth: {
              title: 'Last 6 Month',
              checked: false
            },
            lastYear: {
              title: 'Last Year',
              checked: false
            }
          }}
        />
        <FiltersListingsStatusRow
          name="activeListings"
          active="true"
          title="Active"
          color="#32b86d"
          dropdownItems={{
            contingent: {
              title: 'Contingent',
              checked: true
            },
            kickOut: {
              title: 'Kick Out',
              checked: true
            },
            optionContract: {
              title: 'Option Contract',
              checked: false
            }
          }}
        />
        <FiltersListingsStatusRow
          name="otherListingStatuses"
          title="Other Listing Statuses"
          color="#f5a544"
          dropdownItems={{
            expired: {
              title: 'Expired',
              checked: false
            },
            pending: {
              title: 'Pending',
              checked: false
            },
            canclled: {
              title: 'Canclled',
              checked: false
            },
            withdrawn: {
              title: 'Withdrawn',
              checked: true
            },
            tempOffMarket: {
              title: 'Temp Off Market',
              checked: true
            },
            withdrawnSublisting: {
              title: 'Withdrawn Sublisting',
              checked: true
            }
          }}
        />
        <FiltersListingsStatusRow
          name="openHousesOnlyListings"
          title="Open House Only"
          icon="OH"
          color="#32b86d"
        />
      </div>
    </div>
  </div>

export default Filters
