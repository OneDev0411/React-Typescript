import React from 'react'
import { useSelector } from 'react-redux'

import { IAppState } from 'reducers'
import { getActiveBrand } from 'utils/user-teams'

import { useGetListing, UseGetListing } from './use-get-listing'
import Header from './Header'
import Title from './Title'
import Gallery from './Gallery'
import MainFeatures from './MainFeatures'
import StaticMap from './StaticMap'
import FeaturedImages from './FeaturedImages'
import AgentInfo from './AgentInfo'
import AgentContactForm from './AgentContactForm'

interface Props {
  id: UUID
}

function ListingDetails({ id }: Props) {
  const user = useSelector<IAppState, IUser>((state: IAppState) => state.user)
  const brand = getActiveBrand(user)

  const { listing }: UseGetListing = useGetListing(id)

  if (!listing) {
    return 'Loading...'
  }

  const agent = listing.list_agent

  return (
    <>
      <Header id={listing.id} />
      <Gallery images={listing.gallery_image_urls} />
      <Title
        title="$329,000"
        subtitle1="5127 Vandelia St Medical District"
        subtitle2="Dallas, Texas 75212 | MLS#: 14430312"
      />
      <MainFeatures listing={listing} />
      <StaticMap location={listing.property.address.location} />
      <FeaturedImages images={listing.gallery_image_urls?.slice(5, 8)} />
      <AgentInfo
        name={agent.full_name}
        email={agent.email}
        image={agent.profile_image_url}
        tel={agent.phone_number}
        company={brand?.name}
      />
      <AgentContactForm onSubmit={() => Promise.resolve()} />
      <FeaturedImages images={listing.gallery_image_urls?.slice(8, 11)} />
    </>
  )
}

export default ListingDetails
