import React from 'react'
import Flex from 'styled-flex-component'

import ListingCard from '../ListingCard'
import { MainContainer, MapContainer, ListViewContainer } from './styled'

export function MapView(props) {
  return (
    <MainContainer>
      <MapContainer>{props.Map}</MapContainer>
      <ListViewContainer>
        <Flex style={{ marginBottom: '1.5em' }}>
          <div style={{ fontWeight: 500 }}>{`${
            props.listings.info.total
          } Listings`}</div>
        </Flex>
        {props.listings.data.map(listing => (
          <ListingCard isShowOnMap listing={listing} key={listing.id} />
        ))}
      </ListViewContainer>
    </MainContainer>
  )
}
