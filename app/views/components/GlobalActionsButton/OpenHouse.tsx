import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import { IAppState } from 'reducers'

import SearchListingDrawer from 'components/SearchListingDrawer'
import { OpenHouseDrawer } from 'components/open-house/OpenHouseDrawer'

export default function CreateOpenHouse(
  props: React.ComponentProps<typeof OpenHouseDrawer>
) {
  const [isListingsDrawerOpen, setIsListingsDrawerOpen] = useState(true)
  const [selectedDealOrListing, setSelectedDealOrListing] = useState<
    ICompactListing | IDeal | null
  >(null)
  const deals = useSelector((state: IAppState) =>
    Object.values(state.deals.list).filter(
      (deal: IDeal) => deal.deal_type === 'Selling' && deal.listing
    )
  )

  const handleSelect = (selected: ICompactListing | IDeal) => {
    setSelectedDealOrListing(selected)
  }

  if (isListingsDrawerOpen) {
    return (
      <SearchListingDrawer
        mockListings
        isOpen={isListingsDrawerOpen}
        defaultList={deals}
        defaultListTitle="Select from your selling deals:"
        onClose={() => {
          props.onClose()
          setIsListingsDrawerOpen(false)
        }}
        onSelect={(items: ICompactListing[] | IDeal[]) => {
          setIsListingsDrawerOpen(false)
          handleSelect(items[0])
        }}
      />
    )
  }

  if (selectedDealOrListing) {
    const associations =
      selectedDealOrListing.type === 'deal'
        ? { deal: selectedDealOrListing }
        : { listing: selectedDealOrListing }

    return <OpenHouseDrawer {...props} associations={associations} />
  }

  return null
}
