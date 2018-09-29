import React from 'react'
import Flex from 'styled-flex-component'

import ListingCard from '../ListingCard'

export function MapView(props) {
  const { info } = props.listings

  return (
    <Flex style={{ height: 'calc(100vh - 6rem - 1px)', overflow: 'hidden' }}>
      <div style={{ width: 'calc(100% - 24em - 1px)' }}>{props.Map}</div>
      <div
        style={{
          width: '24em',
          padding: '1.5em',
          borderLeft: '1px solid #d4d4d4',
          overflowY: 'scroll',
          overflowX: 'hidden'
        }}
      >
        <Flex style={{ marginBottom: '1.5em' }}>
          <div style={{ fontWeight: 500 }}>{`${info.total} Listings`}</div>
        </Flex>
        {props.listings.data.map(listing => (
          <ListingCard isShowOnMap listing={listing} key={listing.id} />
        ))}
      </div>
    </Flex>
  )
}
