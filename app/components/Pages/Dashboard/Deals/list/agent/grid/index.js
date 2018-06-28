import React, { Fragment } from 'react'
import { connect } from 'react-redux'

import { Container, NotificationBadge } from './styled'

import Deal from '../../../../../../../models/Deal'

import ToolTip from '../../../../../../../views/components/tooltip'
import Table from '../../../../../../../views/components/Grid/Table'
import EmptyState from './empty-state'

import Address from '../../components/table-columns/address'
import Status from '../../components/table-columns/status'
import DealSide from '../../components/table-columns/side'
import CriticalDate from '../../components/table-columns/critical-date'

import { getPrimaryAgent } from '../../../utils/roles'
import { Filters } from '../filters'

class Grid extends React.Component {
  get Columns() {
    const { roles } = this.props

    return [
      {
        id: 'addres',
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
        render: ({ rowData: deal }) => this.getDealNotification(deal)
      }
    ]
  }

  getPriceValue = deal =>
    Deal.get.field(deal, 'sales_price') ||
    Deal.get.field(deal, 'list_price') ||
    Deal.get.field(deal, 'lease_price')

  get Data() {
    const { deals, activeFilter } = this.props

    if (!activeFilter) {
      return Object.values(deals)
    }

    return Object.values(deals).filter(deal => Filters[activeFilter](deal))
  }

  getGridTrProps = () => ({})

  getDealNotification = ({ new_notifications }) => {
    if (new_notifications === 0) {
      return <Fragment />
    }

    return (
      <ToolTip
        caption={`You have ${new_notifications} unread messages in this deal`}
      >
        <NotificationBadge>{new_notifications}</NotificationBadge>
      </ToolTip>
    )
  }

  render() {
    const columns = this.Columns
    const data = this.Data

    return (
      <Container>
        <Table
          columns={columns}
          data={data}
          emptyState={<EmptyState />}
          getTrProps={this.getGridTrProps}
        />
      </Container>
    )
  }
}

function mapStateToProps({ deals, chatroom }) {
  return {
    deals: deals.list,
    tasks: deals.tasks,
    checklists: deals.checklists,
    roles: deals.roles,
    rooms: chatroom.rooms
  }
}

export default connect(mapStateToProps)(Grid)
