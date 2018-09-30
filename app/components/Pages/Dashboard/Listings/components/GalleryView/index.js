import React from 'react'

import Table from '../../../../../../views/components/Grid/Table'
import LoadingComponent from '../../../../../../views/components/Spinner'

import ListingCard from '../ListingCard'
import { formatListing } from '../../helpers/format-listing'
import { sortOptions } from '../../helpers/sort-plugin-options'
import { bodyStyle, rowStyle } from './styled'

export class GalleryView extends React.Component {
  state = {
    sortBy: {
      index: 'price',
      isDescending: false
    }
  }

  columns = [
    {
      id: 'price',
      accessor: listing => listing.price,
      render: ({ rowData: listing }) => (
        <ListingCard isShowOnMap listing={listing} key={listing.id} />
      )
    }
  ]

  format = listing => formatListing(listing, this.props.user)

  onChangeSort = ({ value: index }) => {
    const isDescending = index.charAt(0) === '-'

    if (isDescending) {
      index = index.slice(1)
    }

    this.setState({
      sortBy: {
        index,
        isDescending
      }
    })
  }

  sort = (a, b) => {
    const { index } = this.state.sortBy

    return this.state.sortBy.isDescending
      ? a[index] - b[index]
      : b[index] - a[index]
  }

  render() {
    const { listings } = this.props

    return (
      <div style={{ padding: '1.5em 1.5em 0.5em' }}>
        <Table
          columns={this.columns}
          data={listings.data.map(this.format).sort(this.sort)}
          isFetching={this.props.isFetching}
          LoadingState={LoadingComponent}
          showTableHeader={false}
          summary={{
            entityName: 'Listings',
            style: { color: '#000' }
          }}
          getBodyProps={() => ({ style: bodyStyle })}
          getTrProps={() => ({ css: rowStyle })}
          plugins={{
            sortable: {
              ...sortOptions,
              onChange: this.onChangeSort
            }
          }}
        />
      </div>
    )
  }
}
