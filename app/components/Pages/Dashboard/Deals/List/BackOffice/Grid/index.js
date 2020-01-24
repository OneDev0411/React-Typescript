import React from 'react'
import { connect } from 'react-redux'

import moment from 'moment'

import Deal from 'models/Deal'

import { getUserSettingsInActiveTeam } from 'utils/user-teams'

import Grid from 'components/Grid/Table'

import { putUserSetting } from 'models/user/put-user-setting'
import { getUserTeams } from 'actions/user/teams'
import flattenBrand from 'utils/flatten-brand'

import { getPrice, getFormattedPrice } from 'models/Deal/helpers/context'

import CriticalDate, {
  getCriticalDateNextValue
} from '../../components/table-columns/CriticalDate'

import EmptyState from './EmptyState'
import LoadingState from '../../components/LoadingState'

import Address from '../../components/table-columns/Address'
import Notifications from '../../components/table-columns/NotificationBadge'

import { getPrimaryAgentName } from '../../../utils/roles'

const SORT_FIELD_SETTING_KEY = 'grid_deals_sort_field_bo'

class BackOfficeGrid extends React.Component {
  get columns() {
    return [
      {
        id: 'status',
        header: 'Status',
        accessor: Deal.get.status
      },
      {
        id: 'address',
        header: 'Address',
        width: '25%',
        verticalAlign: 'center',
        accessor: deal => Deal.get.address(deal, this.props.roles),
        render: ({ row: deal }) => <Address deal={deal} />
      },
      {
        id: 'agent-name',
        header: 'Agent Name',
        accessor: deal => getPrimaryAgentName(deal, this.props.roles),
        render: ({ row: deal }) => getPrimaryAgentName(deal, this.props.roles)
      },
      {
        id: 'office',
        header: 'Office',
        accessor: this.getOffice,
        render: ({ row: deal }) => this.getOffice(deal)
      },
      {
        id: 'submitted-at',
        header: 'Submitted At',
        accessor: 'attention_requested_at',
        render: ({ row: deal }) =>
          this.getSubmitTime(deal.attention_requested_at)
      },
      {
        id: 'critical-dates',
        header: 'Critical Dates',
        accessor: getCriticalDateNextValue,
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
        id: 'contract-price',
        header: 'Contract Price',
        align: 'right',
        accessor: getPrice,
        render: ({ row: deal }) => (
          <div
            style={{
              paddingRight: '1rem'
            }}
          >
            {getFormattedPrice(getPrice(deal))}
          </div>
        )
      },
      {
        id: 'notification',
        header: '',
        width: '50px',
        verticalAlign: 'center',
        render: ({ row: deal }) => (
          <Notifications
            count={deal.attention_requests}
            caption="$count tasks need your attention"
          />
        )
      }
    ]
  }

  get data() {
    const { deals, searchQuery } = this.props

    if (!deals) {
      return []
    }

    // when user searching something in backoffice, we should show all
    // deals except draft items
    if (searchQuery.term.length > 0) {
      return Object.values(deals).filter(deal => deal.is_draft === false)
    }

    if (searchQuery.type === 'inbox') {
      return Object.values(deals).filter(
        deal =>
          deal.attention_requests > 0 &&
          deal.is_draft === false &&
          deal.inboxes &&
          deal.inboxes.includes(searchQuery.filter)
      )
    }

    return Object.values(deals)
  }

  getOffice = deal => {
    const brand = flattenBrand(deal.brand)

    return brand && brand.messages ? brand.messages.branch_title : 'N/A'
  }

  getSubmitTime = attention_requested_at => {
    if (attention_requested_at) {
      const dateTime = moment.unix(attention_requested_at).local()

      if (dateTime.calendar().includes('Today')) {
        return dateTime.calendar()
      }

      return dateTime.format('MMM DD, YYYY [at] hh:mm A')
    }

    return ''
  }

  getDefaultSort = () => {
    let id = sortSetting
    let ascending = true

    const sortSetting =
      getUserSettingsInActiveTeam(this.props.user, SORT_FIELD_SETTING_KEY) ||
      'address'

    if (sortSetting.startsWith('-')) {
      id = sortSetting.slice(1)
      ascending = false
    }

    const column = this.columns.find(col => col.id === id)

    if (!column) {
      return null
    }

    return {
      column: column.id,
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
        LoadingStateComponent={LoadingState}
        EmptyStateComponent={EmptyState}
        loading={this.props.isFetchingDeals ? 'middle' : null}
      />
    )
  }
}

function mapStateToProps({ user, deals }) {
  const { properties, list, roles } = deals

  return {
    isFetchingDeals: properties.isFetchingDeals,
    deals: list,
    user,
    roles
  }
}

export default connect(mapStateToProps)(BackOfficeGrid)
