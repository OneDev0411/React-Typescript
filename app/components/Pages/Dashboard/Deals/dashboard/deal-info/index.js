import React from 'react'
import styled from 'styled-components'

import { getDashboardHeight } from '../../utils/get-dashboard-height'

import ListingCard from '../mls-listing/listing-card'
import CriticalDates from '../factsheet/critical-dates'
import ListingInfo from '../factsheet/listing-info'
import Commission from '../factsheet/commission'
import Roles from '../roles'
import MlsListing from '../mls-listing'
import DealSide from './side'
import ChecklistTypes from './checklist-types'
import GoLive from './go-live'

const DealInfosScrollable = styled.div`
  height: ${({ traningAccount }) => getDashboardHeight(traningAccount)};
  overflow-x: hidden;
`

export default ({ deal, showBackButton = true, traningAccount = false }) => {
  const isWebkit = 'WebkitAppearance' in document.documentElement.style

  return (
    <DealInfosScrollable
      data-simplebar={!isWebkit || null}
      traningAccount={traningAccount}
    >
      <div className="deal-info__inner">
        <ListingCard deal={deal} showBackButton={showBackButton} />

        <GoLive deal={deal} />
        <MlsListing deal={deal} />
        <DealSide deal={deal} />
        <ChecklistTypes propertyType={deal.property_type} />
        <div className="deal-fact-sheet">
          <CriticalDates deal={deal} />
        </div>

        <Roles deal={deal} allowDeleteRole />

        <div className="deal-fact-sheet">
          <ListingInfo deal={deal} />
          <Commission deal={deal} />
        </div>
      </div>
    </DealInfosScrollable>
  )
}
