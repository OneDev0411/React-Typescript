import React from 'react'

import { useGetListing, UseGetListing } from './use-get-listing'

import Header from './Header'
import Title from './Title'
import Gallery from './Gallery'
import MainFeatures from './MainFeatures'

interface Props {
  id: UUID
}

function ListingDetails({ id }: Props) {
  const { listing }: UseGetListing = useGetListing(id)

  return (
    <>
      <Header id={listing?.id} />
      <Gallery images={listing?.gallery_image_urls} />
      <Title
        title="$329,000"
        subtitle1="5127 Vandelia St Medical District"
        subtitle2="Dallas, Texas 75212 | MLS#: 14430312"
      />
      <MainFeatures listing={listing} />
    </>
  )
}

export default ListingDetails
