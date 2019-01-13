import React from 'react'
import { connect } from 'react-redux'

import Deal from 'models/Deal'

import Table from 'components/Grid/Table'

import EmptyState from './EmptyState'
import LoadingState from '../../components/LoadingState'

import AgentAvatars from '../../components/table-columns/AgentAvatars'
import Address from '../../components/table-columns/Address'
import CriticalDate, {
  getCriticalDateNextValue
} from '../../components/table-columns/CriticalDate'
import Notification from '../../components/table-columns/NotificationBadge'

import { getPrimaryAgent, getPrimaryAgentName } from '../../../utils/roles'
import { Filters } from '../Filters'
import { statusSortMethod } from '../../components/table-columns/Status'

class Grid extends React.Component {
  get Columns() {
    const { roles } = this.props

    return [
      {
        id: 'status',
        header: 'Status',
        accessor: deal => Deal.get.status(deal),
        sortMethod: statusSortMethod
      },
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
        accessor: deal => getCriticalDateNextValue(deal),
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
        accessor: deal => getPrimaryAgentName(deal, roles),
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

  getDefaultSort = (id, ascending) => {
    const column = this.Columns.find(col => col.id === id)

    return {
      column,
      ascending
    }
  }

  render() {
    const { isFetchingDeals } = this.props
    const columns = this.Columns
    const data = this.Data

    return (
      <Table
        plugins={{
          sortable: {
            defaultSort: this.getDefaultSort('status', true)
          }
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
