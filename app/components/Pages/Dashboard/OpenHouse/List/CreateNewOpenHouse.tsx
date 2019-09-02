import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Button } from '@material-ui/core'

import SearchListingDrawer from 'components/SearchListingDrawer'
import { getMlsDrawerInitialDeals } from 'components/InstantMarketing/helpers/get-mls-drawer-initial-deals'

interface Props {
  deals: UuidMap<IDeal>
  onOpenDrawer: (item: IDeal | ICompactListing) => void
}

function CreateNewOpenHouse(props: Props) {
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false)

  return (
    <>
      <Button
        color="primary"
        variant="contained"
        onClick={() => setIsSearchDrawerOpen(true)}
      >
        Create an Open House
      </Button>

      <SearchListingDrawer
        mockListings
        isOpen={isSearchDrawerOpen}
        defaultList={getMlsDrawerInitialDeals(props.deals)}
        onClose={() => setIsSearchDrawerOpen(false)}
        onSelect={(items: ICompactListing[] | IDeal[]) => {
          setIsSearchDrawerOpen(false)
          props.onOpenDrawer(items[0])
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

export default connect(mapStateToProps)(CreateNewOpenHouse)
