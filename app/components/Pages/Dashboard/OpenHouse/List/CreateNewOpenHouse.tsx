import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Button } from '@material-ui/core'

import SearchListingDrawer from 'components/SearchListingDrawer'

import { selectSellingDeals } from './open-house-list-helpers'

interface Props {
  deals: IDeal[]
  onOpenDrawer: (item: IDeal | ICompactListing) => void
}

function CreateNewOpenHouse(props: Props) {
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false)

  return (
    <>
      <Button
        size="large"
        variant="contained"
        color="primary"
        onClick={() => setIsSearchDrawerOpen(true)}
      >
        Create Registration Page
      </Button>

      <SearchListingDrawer
        mockListings
        isOpen={isSearchDrawerOpen}
        defaultLists={[
          {
            title: 'Select from your selling deals:',
            items: selectSellingDeals(props.deals)
          }
        ]}
        onClose={() => setIsSearchDrawerOpen(false)}
        onSelect={(items: ICompactListing[] | IDeal[]) => {
          setIsSearchDrawerOpen(false)
          props.onOpenDrawer(items[0])
        }}
      />
    </>
  )
}

function mapStateToProps(state) {
  return {
    deals: Object.values(state.deals.list)
  }
}

export default connect(mapStateToProps)(CreateNewOpenHouse)
