import React from 'react'
import { connect } from 'react-redux'
import { Container } from './styled'

import Deal from '../../../../../../../models/Deal'

import Table from '../../../../../../../views/components/Grid/Table'
import EmptyState from './empty-state'
import LoadingState from '../../components/loading-state'

import Address from '../../components/table-columns/address'
import Status from '../../components/table-columns/status'
import DealSide from '../../components/table-columns/side'
import CriticalDate from '../../components/table-columns/critical-date'
import Notification from '../../components/table-columns/notification-badge'

import { getPrimaryAgent } from '../../../utils/roles'
import { Filters } from '../filters'

import getGridTrProps from '../../helpers/get-tr-props'
import getGridTdProps from '../../helpers/get-td-props'

class Grid extends React.Component {
  get Columns() {
    const { roles } = this.props

    return [
      {
        id: 'address',
        header: 'ADDRESS',
        width: '28%',
        render: ({ rowData: deal }) => <Address deal={deal} roles={roles} />
      },
      {
        id: 'status',
        header: 'STATUS',
        width: '15%',
        render: ({ rowData: deal }) => <Status deal={deal} />
      },
      {
        id: 'checklist-type',
        header: 'CHECKLIST TYPE',
        render: ({ rowData: deal }) => deal.property_type
      },
      {
        id: 'price',
        header: 'PRICE $',
        render: ({ rowData: deal }) =>
          Deal.get.formattedPrice(this.getPriceValue(deal), 'currency', 0)
      },
      {
        id: 'side',
        header: 'SIDE',
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
        header: 'CRITICAL DATES',
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
        header: 'AGENT NAME',
        render: ({ rowData: deal }) => getPrimaryAgent(deal, roles)
      },
      {
        id: 'notification',
        header: '',
        width: '40px',
        render: ({ rowData: deal }) => (
          <Notification
            count={deal.new_notifications ? deal.new_notifications.length : 0}
            caption="You have $count unread messages in this deal"
          />
        )
      }
    ]
  }

  getPriceValue = deal =>
    Deal.get.field(deal, 'sales_price') ||
    Deal.get.field(deal, 'list_price') ||
    Deal.get.field(deal, 'lease_price')

  get Data() {
    const { deals, activeFilter } = this.props

    if (!deals) {
      return []
    }

    if (!activeFilter) {
      return Object.values(deals)
    }

    return Object.values(deals).filter(deal => Filters[activeFilter](deal))
  }

  render() {
    const { isFetchingDeals } = this.props
    const columns = this.Columns
    const data = this.Data

    return (
      <Container>
        <Table
          isFetching={isFetchingDeals}
          columns={columns}
          data={data}
          getTrProps={getGridTrProps}
          getTdProps={getGridTdProps}
          EmptyState={EmptyState}
          LoadingState={LoadingState}
        />
      </Container>
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
