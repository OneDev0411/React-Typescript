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
      accessor: agent => Object.keys(agent.listings).length,
      render: ({ rowData: agent }) => Object.keys(agent.listings).length
    },
    {
      id: 'buyers',
      header: '# of Buyers',
      accessor: agent => agent.soldListings.length,
      render: ({ rowData: agent }) => agent.soldListings.length
    },
    {
      id: 'value_in',
      header: 'Value in $',
      accessor: agent => agent.soldListingsTotalValue,
      render: ({ rowData: agent }) =>
        agent.soldListingsTotalValue
          ? `$${agent.soldListingsTotalValue.toLocaleString()}`
          : 0
    },
    {
      id: 'avg_price',
      header: 'Avg Price',
      accessor: agent => agent.listingsAveragePrice,
      render: ({ rowData: agent }) =>
        agent.listingsAveragePrice
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
      render: ({ selectedRows }) => (
        <SendDealPromotionCard
          deal={this.props.deal}
          selectedRows={selectedRows}
        >
          Promote Listing
        </SendDealPromotionCard>
      )
    }
  ]

  render() {
    const selectedRowsCount = this.props.selectedRows.length

    return (
      <div style={{ padding: '0 1.5em' }}>
        <Table
          summary={{
            text:
              selectedRowsCount > 0
                ? '<strong style="color:#000;">[selectedRows]</strong> of [totalRows] agents'
                : '[totalRows] agents',
            selectedRows: selectedRowsCount,
            totalRows: this.props.listInfo.total || 0
          }}
          data={this.props.data}
          columns={this.columns}
          isFetching={this.props.isFetching}
          LoadingState={Loading}
          plugins={{
            sortable: {},
            selectable: {
              persistent: true,
              storageKey: 'agents',
              onChange: this.props.onChangeSelectedRows
            },
            actionable: {
              actions: this.actions
            }
          }}
        />
      </div>
    )
  }
}
