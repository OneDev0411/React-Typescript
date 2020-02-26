import React, { useMemo } from 'react'
import { WithRouterProps, withRouter } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'

import { TableCellProps } from '@material-ui/core'

import Grid from 'components/Grid/Table'

import { IAppState } from 'reducers'

import {
  getAddress,
  getStatus,
  getFormattedPrice,
  getPrice
} from 'models/Deal/helpers/context'

import { getUserSettingsInActiveTeam } from 'utils/user-teams'
import { putUserSetting } from 'models/user/put-user-setting'
import { getUserTeams } from 'actions/user/teams'
import flattenBrand from 'utils/flatten-brand'

import { SearchQuery } from '../types'

import { getPrimaryAgentName } from '../../../utils/roles'
import EmptyState from './EmptyState'
import LoadingState from '../../components/LoadingState'
import { Address } from '../../components/table-columns/Address'

import CriticalDate, {
  getCriticalDateNextValue
} from '../../components/table-columns/CriticalDate'

import { SORTABLE_COLUMNS } from '../helpers/sortable-columns'

const SORT_FIELD_SETTING_KEY = 'grid_deals_sort_field_bo'

interface Props {
  searchQuery: SearchQuery
}

function BackOfficeGrid(props: Props & WithRouterProps) {
  const dispatch = useDispatch()

  const { isFetchingDeals, deals, user, roles } = useSelector(
    ({ user, deals }: IAppState) => ({
      isFetchingDeals: deals.properties.isFetchingDeals,
      deals: deals.list,
      user,
      roles: deals.roles
    })
  )

  const getOffice = (deal: IDeal) => {
    const brand = flattenBrand(deal.brand)

    return brand && brand.messages ? brand.messages.branch_title : 'N/A'
  }

  const getSubmitTime = (attention_requested_at: number): string => {
    if (attention_requested_at) {
      const dateTime = moment.unix(attention_requested_at).local()

      if (dateTime.calendar().includes('Today')) {
        return dateTime.calendar()
      }

      return dateTime.format('MMM DD [at] hh:mm A')
    }

    return ''
  }

  const columns = useMemo(() => {
    return [
      {
        id: 'address',
        header: 'Address',
        width: '25%',
        accessor: (deal: IDeal) => getAddress(deal, roles),
        render: ({ row: deal }) => <Address deal={deal} />
      },
      {
        id: 'status',
        header: 'Status',
        accessor: getStatus
      },
      {
        id: 'agent-name',
        header: 'Agent Name',
        accessor: (deal: IDeal) => getPrimaryAgentName(deal, roles),
        render: ({ row: deal }: { row: IDeal }) =>
          getPrimaryAgentName(deal, roles)
      },
      {
        id: 'office',
        header: 'Office',
        accessor: getOffice,
        render: ({ row: deal }: { row: IDeal }) => getOffice(deal)
      },
      {
        id: 'submitted-at',
        header: 'Submitted At',
        accessor: (deal: IDeal) => deal.attention_requested_at,
        render: ({ row: deal }: { row: IDeal }) =>
          getSubmitTime(deal.attention_requested_at)
      },
      {
        id: 'critical-dates',
        header: 'Critical Dates',
        accessor: getCriticalDateNextValue,
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
        id: 'contract-price',
        header: 'Contract Price',
        align: 'right' as TableCellProps['align'],
        accessor: getPrice,
        render: ({ row: deal }: { row: IDeal }) => (
          <div>{getFormattedPrice(getPrice(deal))}</div>
        )
      }
    ]
  }, [roles, user])

  const getData = (): IDeal[] => {
    if (!deals) {
      return []
    }

    // when user searching something in backoffice, we should show all
    // deals except draft items
    if (props.searchQuery.term.length > 0) {
      return (Object.values(deals) as IDeal[]).filter(
        (deal: IDeal) => deal.is_draft === false
      )
    }

    if (props.searchQuery.type === 'inbox') {
      return (Object.values(deals) as IDeal[]).filter(
        (deal: IDeal) =>
          deal.attention_requests > 0 &&
          deal.is_draft === false &&
          deal.inboxes &&
          deal.inboxes.includes(props.searchQuery.filter)
      )
    }

    return Object.values(deals)
  }

  const getSort = () => {
    if (props.location.query.sortBy) {
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

  const data = getData()

  return (
    <Grid<IDeal>
      sorting={{
        columns: SORTABLE_COLUMNS,
        onChange: handleChangeSort,
        sortBy: getSort()
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

export default withRouter(BackOfficeGrid)
