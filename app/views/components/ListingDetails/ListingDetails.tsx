import React from 'react'

import { useGetListing, UseGetListing } from './use-get-listing'

import Header from './Header'

interface Props {
  id: UUID
}

function ListingDetails({ id }: Props) {
  const { listing }: UseGetListing = useGetListing(id)

  return (
    <>
      <Header id={listing?.id} />
    </>
  )
}

export default ListingDetails
