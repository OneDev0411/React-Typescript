import React, { useMemo } from 'react'
import { WithRouterProps, withRouter } from 'react-router'
import { useSelector } from 'react-redux'
import moment from 'moment'

import { TableCellProps } from '@material-ui/core'

import Grid from 'components/Grid/Table'
import { useGridStyles } from 'components/Grid/Table/styles'

import { IAppState } from 'reducers'

import {
  getStatus,
  getFormattedPrice,
  getPrice
} from 'models/Deal/helpers/context'

import flattenBrand from 'utils/flatten-brand'

import { getGridSort } from 'deals/List/helpers/sorting'

import { SearchQuery } from '../types'

import { getPrimaryAgentName } from '../../../utils/roles'
import EmptyState from './EmptyState'
import LoadingState from '../../components/LoadingState'
import { Address } from '../../components/table-columns/Address'

import CriticalDate, {
  getCriticalDateNextValue
} from '../../components/table-columns/CriticalDate'

import {
  SORTABLE_COLUMNS,
  SORT_FIELD_SETTING_KEY
} from '../helpers/backoffice-sorting'

interface Props {
  searchQuery: SearchQuery
}

function BackOfficeGrid(props: Props & WithRouterProps) {
  const gridClasses = useGridStyles()

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
        width: '25%',
        accessor: (deal: IDeal) => deal.title,
        render: ({ row: deal }) => (
          <Address deal={deal} notificationsCount={deal.attention_requests} />
        )
      },
      {
        id: 'status',
        class: 'opaque',
        accessor: getStatus
      },
      {
        id: 'agent-name',
        class: 'opaque',
        accessor: (deal: IDeal) => getPrimaryAgentName(deal, roles),
        render: ({ row: deal }: { row: IDeal }) =>
          getPrimaryAgentName(deal, roles)
      },
      {
        id: 'office',
        class: 'opaque',
        accessor: getOffice,
        render: ({ row: deal }: { row: IDeal }) => getOffice(deal)
      },
      {
        id: 'submitted-at',
        class: 'opaque',
        accessor: (deal: IDeal) => deal.attention_requested_at,
        render: ({ row: deal }: { row: IDeal }) =>
          getSubmitTime(deal.attention_requested_at)
      },
      {
        id: 'critical-dates',
        class: 'opaque',
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
        class: 'opaque',
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

  const data = getData()

  return (
    <Grid<IDeal>
      sorting={{
        columns: SORTABLE_COLUMNS,
        sortBy: getGridSort(
          user,
          columns,
          props.location,
          SORT_FIELD_SETTING_KEY
        )
      }}
      columns={columns}
      rows={data}
      totalRows={data.length}
      virtualize={data.length > 150}
      LoadingStateComponent={LoadingState}
      EmptyStateComponent={EmptyState}
      loading={isFetchingDeals ? 'middle' : null}
      classes={{
        row: gridClasses.row
      }}
    />
  )
}

export default withRouter(BackOfficeGrid)
