import React from 'react'
import { connect } from 'react-redux'

import Deal from 'models/Deal'

import Grid from 'components/Grid/Table'

import { getUserSettingsInActiveTeam } from 'utils/user-teams'

import { putUserSetting } from 'models/user/put-user-setting'
import { getUserTeams } from 'actions/user/teams'

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

const SORT_FIELD_SETTING_KEY = 'grid_deals_sort_field'

class AgentGrid extends React.Component {
  get columns() {
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
        accessor: deal => Deal.get.address(deal, roles),
        render: ({ row: deal, totalRows, rowIndex }) => (
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
        align: 'right',
        accessor: deal => this.getPriceValue(deal),
        render: ({ row: deal }) =>
          Deal.get.formattedPrice(this.getPriceValue(deal), 'currency', 0)
      },
      {
        id: 'critical-dates',
        header: 'Critical Dates',
        accessor: deal => getCriticalDateNextValue(deal),
        render: ({ row: deal, totalRows, rowIndex }) => (
          <CriticalDate
            deal={deal}
            user={this.props.user}
            rowId={rowIndex + 1}
            rowsCount={totalRows}
          />
        )
      },
      {
        id: 'agent-name',
        header: 'Agent',
        accessor: deal => getPrimaryAgentName(deal, roles),
        render: ({ row: deal }) => {
          return <AgentAvatars agent={getPrimaryAgent(deal, roles)} />
        }
      },
      {
        id: 'notification',
        header: '',
        render: ({ row: deal }) => (
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

  get data() {
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

  getDefaultSort = () => {
    const sortSetting =
      getUserSettingsInActiveTeam(this.props.user, SORT_FIELD_SETTING_KEY) ||
      'status'
    let id = sortSetting
    let ascending = true

    if (sortSetting.startsWith('-')) {
      id = sortSetting.slice(1)
      ascending = false
    }

    const column = this.columns.find(col => col.id === id)

    return {
      columnId: column.id,
      ascending
    }
  }

  handleChangeSort = async item => {
    await putUserSetting(SORT_FIELD_SETTING_KEY, item.value)

    this.props.dispatch(getUserTeams(this.props.user))
  }

  render() {
    return (
      <Grid
        sorting={{
          defaultSort: this.getDefaultSort(),
          onChange: this.handleChangeSort
        }}
        columns={this.columns}
        rows={this.data}
        LoadingState={LoadingState}
        EmptyState={EmptyState}
        loading={this.props.isFetchingDeals ? 'middle' : null}
      />
    )
  }
}

function mapStateToProps({ user, deals }) {
  const { properties, list, roles } = deals

  return {
    contexts: deals.contexts,
    isFetchingDeals: properties.isFetchingDeals,
    deals: list,
    roles,
    user
  }
}

export default connect(mapStateToProps)(AgentGrid)
