import React from 'react'
import { connect } from 'react-redux'

import Deal from '../../../../../../../models/Deal'

import Table from '../../../../../../../views/components/Grid/Table'
import EmptyState from './empty-state'
import LoadingState from '../../components/loading-state'

import Address from '../../components/table-columns/address'
import DealSide from '../../components/table-columns/side'
import CriticalDate, {
  getNextDateValue
} from '../../components/table-columns/critical-date'
import Notification from '../../components/table-columns/notification-badge'

import { getPrimaryAgent } from '../../../utils/roles'
import { Filters } from '../filters'

import getGridTrProps from '../../helpers/get-tr-props'
import AgentAvatars from '../../components/table-columns/AgentAvatars'

class Grid extends React.Component {
  get Columns() {
    const { roles } = this.props

    return [
      {
        id: 'address',
        header: 'Address',
        width: '30%',
        accessor: deal => Deal.get.address(deal, roles),
        render: ({ rowData: deal }) => <Address deal={deal} roles={roles} />
      },
      {
        id: 'price',
        header: '$ Price',
        accessor: deal => this.getPriceValue(deal),
        render: ({ rowData: deal }) =>
          Deal.get.formattedPrice(this.getPriceValue(deal), 'currency', 0)
      },
      {
        id: 'side',
        header: 'Side',
        accessor: deal => deal.deal_type,
        render: ({ rowData: deal, totalRows, rowIndex }) => (
          <DealSide
            deal={deal}
            roles={roles}
            rowId={rowIndex + 1}
            rowsCount={totalRows}
          />
        )
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
        accessor: deal => <AgentAvatars agent={getPrimaryAgent(deal, roles)} />
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
    const field = ['sales_price', 'list_price', 'lease_price'].find(
      name => Deal.get.field(deal, name) !== null
    )

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
        getTrProps={getGridTrProps}
        EmptyState={EmptyState}
        LoadingState={LoadingState}
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
