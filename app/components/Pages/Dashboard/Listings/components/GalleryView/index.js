import React from 'react'

import { connect } from 'react-redux'

import { putUserSetting } from 'models/user/put-user-setting'
import getUserTeams from 'actions/user/teams'
import { getActiveTeamSettings } from 'utils/user-teams'

import Table from '../../../../../../views/components/Grid/Table'
import LoadingComponent from '../../../../../../views/components/Spinner'

import ListingCard from '../ListingCard'
import { formatListing } from '../../helpers/format-listing'
import { bodyStyle, rowStyle } from './styled'

const SORT_FIELD_SETTING_KEY = 'grid_properties_sort_field'

class GalleryViewComponent extends React.Component {
  columns = [
    {
      id: 'price',
      header: 'Price',
      sortType: 'number',
      render: ({ rowData: listing }) => (
        <ListingCard isShowOnMap listing={listing} key={listing.value} />
      )
    },
    {
      id: 'beds',
      header: 'Bedrooms',
      sortType: 'number',
      accessor: item => item.beds,
      render: false
    },
    {
      id: 'baths',
      header: 'Bathrooms',
      sortType: 'number',
      render: false
    },
    {
      id: 'sqft',
      header: 'Sqft',
      sortType: 'number',
      render: false
    },
    {
      id: 'lotSizeArea',
      header: 'Lot Size Area',
      sortType: 'number',
      render: false
    },
    {
      id: 'builtYear',
      header: 'Year Built',
      sortType: 'number',
      render: false
    }
  ]

  format = listing => formatListing(listing, this.props.user)

  getDefaultSort = () => {
    const sortSetting =
      getActiveTeamSettings(this.props.user, SORT_FIELD_SETTING_KEY) || '-price'
    let id = sortSetting
    let ascending = false

    if (sortSetting.startsWith('-')) {
      id = sortSetting.slice(1)
    } else {
      ascending = true
    }

    const column = this.columns.find(col => col.id === id)

    return {
      column,
      ascending
    }
  }

  getDefaultIndex = () =>
    getActiveTeamSettings(this.props.user, SORT_FIELD_SETTING_KEY) || '-price'

  render() {
    const { listings } = this.props

    const defaultSort = this.getDefaultSort()
    const defaultIndex = this.getDefaultIndex()

    return (
      <div style={{ padding: '1.5em 1.5em 0.5em' }}>
        <Table
          columns={this.columns}
          data={listings.data.map(this.format)}
          isFetching={this.props.isFetching}
          LoadingState={LoadingComponent}
          showTableHeader={false}
          summary={{
            entityName: 'Listings',
            style: { color: '#000' }
          }}
          getBodyProps={() => ({ style: bodyStyle })}
          getTrProps={() => ({ css: rowStyle })}
          getTdProps={() => ({ style: { padding: 0 } })}
          plugins={{
            sortable: {
              defaultSort,
              defaultIndex,
              onPostChange: async item => {
                await putUserSetting(SORT_FIELD_SETTING_KEY, item.value)
                await this.props.getUserTeams(this.props.user)
              }
            }
          }}
        />
      </div>
    )
  }
}

export const GalleryView = connect(
  ({ user }) => ({ user }),
  { getUserTeams }
)(GalleryViewComponent)
