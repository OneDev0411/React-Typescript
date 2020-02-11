import React from 'react'

import Table from '../../../../../../views/components/Grid/Table'
import LoadingComponent from '../../../../../../views/components/Spinner'

import ListingCard from '../ListingCard'

const columns = [
  {
    id: 'price',
    accessor: listing => listing.price,
    render: ({ row: listing }) => (
      <ListingCard isShowOnMap listing={listing} key={listing.id} />
    )
  }
]

export default function GridView(props) {
  return (
    <div style={{ padding: ' 0 1.5em 1.5em' }}>
      <Table
        columns={columns}
        rows={props.sortedListings}
        loading={props.isFetching ? 'middle' : null}
        LoadingStateComponent={LoadingComponent}
        totalRows={props.totalRows}
        summary={total => `${total} Listings`}
        hoverable={false}
        getTdProps={() => ({
          padding: 0
        })}
      />
    </div>
  )
}
