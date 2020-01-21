import React from 'react'

import Table from '../../../../../../views/components/Grid/Table'
import LoadingComponent from '../../../../../../views/components/Spinner'

import ListingCard from '../ListingCard'
import { formatListing } from '../../helpers/format-listing'
import { sortOptions } from '../../helpers/sort-plugin-options'
// import { bodyStyle, rowStyle } from './styled'

const columns = [
  {
    id: 'price',
    accessor: listing => listing.price,
    render: ({ row: listing }) => (
      <ListingCard isShowOnMap listing={listing} key={listing.id} />
    )
  }
]

export function GalleryView(props) {
  const format = listing => formatListing(listing, props.user)

  return (
    <div style={{ padding: ' 0 1.5em 1.5em' }}>
      <Table
        columns={columns}
        rows={props.listings.data.map(format)}
        loading={props.isFetching ? 'middle' : null}
        LoadingState={LoadingComponent}
        totalRows={props.listings.info.total}
        summary={total => `${total} Listings`}
        sorting={sortOptions}
        hoverable={false}
        getTdProps={() => ({
          padding: 0
        })}
      />
    </div>
  )
}
