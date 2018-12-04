import React from 'react'
import { connect } from 'react-redux'

import Deal from '../../../../../../../models/Deal'

import Table from '../../../../../../../views/components/Grid/Table'
import EmptyState from './empty-state'
import LoadingState from '../../components/loading-state'

import Address from '../../components/table-columns/address'
import CriticalDate, {
  getNextDateValue
} from '../../components/table-columns/critical-date'
import Notification from '../../components/table-columns/notification-badge'

import { getPrimaryAgent } from '../../../utils/roles'
import { Filters } from '../filters'

import AgentAvatars from '../../components/table-columns/AgentAvatars'

class Grid extends React.Component {
  get Columns() {
    const { roles } = this.props

    return [
      {
        id: 'address',
        header: 'Address',
        width: '50%',
        accessor: deal => Deal.get.address(deal, roles),
        render: ({ rowData: deal, totalRows, rowIndex }) => (
          <Address
            deal={deal}
            roles={roles}
            totalRows={totalRows}
            rowIndex={rowIndex}
          />
        )
      },
      {
        id: 'price',
        header: '$ Price',
        sortType: 'number',
        accessor: deal => this.getPriceValue(deal),
        render: ({ rowData: deal }) =>
          Deal.get.formattedPrice(this.getPriceValue(deal), 'currency', 0)
      },

      {
        id: 'critical-dates',
        header: 'Critical Dates',
        accessor: deal => getNextDateValue(deal),
        render: ({ rowData: deal, totalRows, rowIndex }) => (
          <CriticalDate
            deal={deal}
            rowId={rowIndex + 1}
            rowsCount={totalRows}
          />
        )
      },
      {
        id: 'agent-name',
        header: 'Agent',
        width: '100px',
        render: ({ rowData: deal }) => (
          <AgentAvatars agent={getPrimaryAgent(deal, roles)} />
        )
      },
      {
        id: 'notification',
        header: '',
        width: '50px',

        render: ({ rowData: deal }) => (
          <Notification
            count={deal.new_notifications ? deal.new_notifications.length : 0}
            caption="You have $count unread messages in this deal"
          />
        )
      }
    ]
  }

  getPriceValue = deal => {
    const field = [
      'sales_price',
      'leased_price',
      'list_price',
      'lease_price'
    ].find(name => Deal.get.field(deal, name) !== null)

    return Deal.get.field(deal, field)
  }

  get Data() {
    const { deals, activeFilter } = this.props

    if (!deals) {
      return []
    }

    const filterFn =
      activeFilter && Filters[activeFilter]
        ? Filters[activeFilter]
        : Filters.All

    return Object.values(deals).filter(deal => filterFn(deal))
  }

  getTdProps = (colIndex, { column }) => {
    if (['address', 'agent-name', 'notification'].includes(column.id)) {
      return {
        style: {
          alignSelf: 'center'
        }
      }
    }

    return {}
  }

  render() {
    const { isFetchingDeals } = this.props
    const columns = this.Columns
    const data = this.Data

    return (
      <Table
        plugins={{
          sortable: {}
        }}
        isFetching={isFetchingDeals}
        columns={columns}
        data={data}
        EmptyState={EmptyState}
        LoadingState={LoadingState}
        getTdProps={this.getTdProps}
      />
    )
  }
}

function mapStateToProps({ deals }) {
  const { properties, list, roles } = deals

  return {
    isFetchingDeals: properties.isFetchingDeals,
    deals: list,
    roles
  }
}

export default connect(mapStateToProps)(Grid)
