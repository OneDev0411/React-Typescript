import React from 'react'

import Loading from '../../../../../../views/components/Spinner'
import Table from '../../../../../../views/components/Grid/Table'
import SendDealPromotionCard from '../../../../../../views/components/InstantMarketing/Flows/SendDealPromotion'

import { Name } from './columns/Name'
import { Company } from './columns/Company'
import { ContactInfo } from './columns/ContactInfo'

export class Grid extends React.Component {
  columns = [
    {
      id: 'name',
      header: 'Name',
      width: '20%',
      accessor: agent => agent.name,
      render: ({ rowData: agent }) => <Name name={agent.name} />
    },
    {
      id: 'company',
      header: 'Company',
      width: '17%',
      accessor: agent => agent.company,
      render: ({ rowData: agent }) => <Company name={agent.company} />
    },
    {
      id: 'listings',
      header: '# of Listings',
      accessor: agent => agent.asListing.length,
      render: ({ rowData: agent }) => agent.asListing.length
    },
    {
      id: 'buyers',
      header: '# of Buyers',
      accessor: agent => agent.asBuyers.length,
      render: ({ rowData: agent }) => agent.asBuyers.length
    },
    {
      id: 'value_in',
      header: 'Volume in $',
      accessor: agent => agent.listingsTotalVolume,
      render: ({ rowData: agent }) =>
        agent.listingsTotalVolume > 0
          ? `$${agent.listingsTotalVolume.toLocaleString()}`
          : 0
    },
    {
      id: 'avg_price',
      header: 'Avg Price',
      accessor: agent => agent.listingsAveragePrice,
      render: ({ rowData: agent }) =>
        agent.listingsAveragePrice > 0
          ? `$${agent.listingsAveragePrice.toLocaleString()}`
          : 0
    },
    {
      id: 'email',
      header: 'Contact Info',
      width: '23%',
      sortable: false,
      accessor: agent => agent.email,
      render: ({ rowData: agent }) => <ContactInfo agent={agent} />
    }
  ]

  actions = [
    {
      display: props => props.selectedRows.length > 0,
      render: props => (
        <SendDealPromotionCard
          deal={this.props.deal}
          selectedRows={props.selectedRows}
        >
          Promote Listing
        </SendDealPromotionCard>
      )
    }
  ]

  render() {
    return (
      <div style={{ padding: '0 1.5em' }}>
        <Table
          data={this.props.data}
          columns={this.columns}
          LoadingState={Loading}
          isFetching={this.props.isFetching}
          isFetchingMore={this.props.isFetchingMore}
          summary={{ entityName: 'Agents' }}
          plugins={{
            sortable: {},
            selectable: {
              persistent: true,
              storageKey: 'agents'
            },
            actionable: {
              actions: this.actions
            },
            loadable: {
              accuracy: 300, // px
              debounceTime: 300, // ms
              onTrigger: this.props.onRequestLoadMore
            }
          }}
        />
      </div>
    )
  }
}
