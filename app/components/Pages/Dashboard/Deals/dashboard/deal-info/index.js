import React from 'react'
import ListingCard from '../mls-listing/listing-card'
import CriticalDates from '../factsheet/critical-dates'
import ListingInfo from '../factsheet/listing-info'
import Commission from '../factsheet/commission'
import Roles from '../roles'
import MlsListing from '../mls-listing'
import DealSide from './side'
import DealEmail from '../deal-email'
import styled from 'styled-components'

const DealInfosScrollable = styled.div`
  height: calc(
    100vh - 54px - 2px ${props => (props.traningAccount ? ' - 48px' : '')}
  );
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

        <MlsListing deal={deal} />
        <DealSide deal={deal} />
        <DealEmail dealEmail={deal.email} marginBottom />

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
