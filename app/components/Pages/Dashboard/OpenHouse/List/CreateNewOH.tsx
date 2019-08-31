import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Button } from '@material-ui/core'

import SearchListingDrawer from 'components/SearchListingDrawer'
import { getMlsDrawerInitialDeals } from 'components/InstantMarketing/helpers/get-mls-drawer-initial-deals'

interface Props {
  deals: UuidMap<IDeal>
  onOpenOHDrawer: (item: IDeal | ICompactListing) => void
}

function CreateNewOH(props: Props) {
  const [isOpenSearchDrawer, setIsOpenSearchDrawer] = useState(false)

  return (
    <>
      <Button
        color="primary"
        variant="contained"
        onClick={() => setIsOpenSearchDrawer(true)}
      >
        Create an Open House
      </Button>

      <SearchListingDrawer
        mockListings
        isOpen={isOpenSearchDrawer}
        defaultList={getMlsDrawerInitialDeals(props.deals)}
        onClose={() => setIsOpenSearchDrawer(false)}
        onSelect={(items: ICompactListing[] | IDeal[]) => {
          setIsOpenSearchDrawer(false)
          props.onOpenOHDrawer(items[0])
        }}
      />
    </>
  )
}

function mapStateToProps({ deals }) {
  return {
    deals: deals.list
  }
}

export default connect(mapStateToProps)(CreateNewOH)
