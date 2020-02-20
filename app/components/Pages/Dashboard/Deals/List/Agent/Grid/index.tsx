import React, { useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { withRouter, WithRouterProps } from 'react-router'

import Grid from 'components/Grid/Table'
import { SortableColumn } from 'components/Grid/Table/types'

import { getUserSettingsInActiveTeam } from 'utils/user-teams'

import { putUserSetting } from 'models/user/put-user-setting'
import { getUserTeams } from 'actions/user/teams'

import { IAppState } from 'reducers'

import {
  getStatus,
  getAddress,
  getField,
  getFormattedPrice
} from 'models/Deal/helpers/context'

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

interface Props {
  sortableColumns: SortableColumn[]
  activeFilter: string
}

function AgentGrid(props: Props & WithRouterProps) {
  const dispatch = useDispatch()
  const { isFetchingDeals, deals, roles, user } = useSelector(
    ({ deals, user }: IAppState) => ({
      isFetchingDeals: deals.properties.isFetchingDeals,
      deals: deals.list,
      roles: deals.roles,
      user
    })
  )

  const columns = useMemo(() => {
    return [
      {
        id: 'address',
        header: 'Address',
        width: '50%',
        accessor: (deal: IDeal) => getAddress(deal, roles),
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
        id: 'status',
        header: 'Status',
        accessor: (deal: IDeal) => getStatus(deal),
        sortMethod: statusSortMethod
      },
      {
        id: 'price',
        header: '$ Price',
        sortType: 'number',
        accessor: (deal: IDeal) => getPriceValue(deal),
        render: ({ row: deal }) =>
          getFormattedPrice(getPriceValue(deal), 'currency', 0)
      },
      {
        id: 'critical-dates',
        header: 'Critical Dates',
        accessor: (deal: IDeal) => getCriticalDateNextValue(deal),
        render: ({ row: deal, totalRows, rowIndex }) => (
          <CriticalDate
            deal={deal}
            user={user}
            rowId={rowIndex + 1}
            rowsCount={totalRows}
          />
        )
      },
      {
        id: 'agent-name',
        header: 'Agent',
        accessor: (deal: IDeal) => getPrimaryAgentName(deal, roles),
        render: ({ row: deal }) => {
          return <AgentAvatars agent={getPrimaryAgent(deal, roles)} />
        }
      }
    ]
  }, [roles, user])

  const data = useMemo(() => {
    if (!deals) {
      return []
    }

    const filterFn =
      props.activeFilter && Filters[props.activeFilter]
        ? Filters[props.activeFilter]
        : Filters.all

    return Object.values(deals).filter(deal => filterFn(deal)) as IDeal[]
  }, [deals, props.activeFilter])

  const getSort = () => {
    if (props.location.search) {
      return {
        value: props.location.query.sortBy,
        ascending: props.location.query.sortType === 'asc'
      }
    }

    const sortSetting =
      getUserSettingsInActiveTeam(user, SORT_FIELD_SETTING_KEY) || 'status'

    let id = sortSetting
    let ascending = true

    if (sortSetting.startsWith('-')) {
      id = sortSetting.slice(1)
      ascending = false
    }

    const column = columns.find(col => col.id === id)!

    if (!column) {
      return null
    }

    return {
      value: column.id,
      ascending
    }
  }

  const handleChangeSort = async item => {
    await putUserSetting(SORT_FIELD_SETTING_KEY, item.value)
    dispatch(getUserTeams(user))
  }

  return (
    <Grid<IDeal>
      sorting={{
        columns: props.sortableColumns,
        sortBy: getSort(),
        onChange: handleChangeSort
      }}
      columns={columns}
      rows={data}
      totalRows={data.length}
      LoadingStateComponent={LoadingState}
      EmptyStateComponent={EmptyState}
      loading={isFetchingDeals ? 'middle' : null}
    />
  )
}

function getPriceValue(deal: IDeal): string {
  const field = [
    'sales_price',
    'leased_price',
    'list_price',
    'lease_price'
  ].find(name => getField(deal, name) !== null)

  return getField(deal, field)
}

export default withRouter(AgentGrid)
