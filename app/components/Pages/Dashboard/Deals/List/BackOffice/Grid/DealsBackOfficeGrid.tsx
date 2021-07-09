import { useSelector } from 'react-redux'
import moment from 'moment'

import { TableCellProps } from '@material-ui/core'

import { withRouter, WithRouterProps } from 'react-router'

import { useMemo } from 'react'

import Grid from 'components/Grid/Table'
import { useGridStyles } from 'components/Grid/Table/styles'

import {
  getStatus,
  getFormattedPrice,
  getPrice
} from 'models/Deal/helpers/context'

import { sortDealsStatus } from 'utils/sort-deals-status'

import { getGridSort } from 'deals/List/helpers/sorting'

import { selectUser } from 'selectors/user'

import { useBrandChecklists } from '@app/hooks/use-brand-checklists'

import { getActiveTeamId } from '@app/utils/user-teams'

import { SearchQuery } from '../types'

import { getPrimaryAgentName } from '../../../utils/roles'
import { ContactsZeroState } from './ZeroState'
import LoadingState from '../../components/LoadingState'
import { Address } from '../../components/table-columns/Address'

import CriticalDate, {
  getCriticalDateNextValue
} from '../../components/table-columns/CriticalDate'

import {
  SORTABLE_COLUMNS,
  SORT_FIELD_SETTING_KEY
} from '../helpers/backoffice-sorting'
import useDealsGetGridData from '../../hooks/use-deals-get-grid-data'

interface DealsBackOfficeGridProps extends WithRouterProps {
  searchQuery: SearchQuery
  statuses: IDealStatus[]
}

function DealsBackOfficeGrid({
  searchQuery,
  statuses,
  location
}: DealsBackOfficeGridProps) {
  const gridClasses = useGridStyles()

  const { deals, roles, isLoading, isClosingsTab } = useDealsGetGridData(
    searchQuery.filter
  )
  const user = useSelector(selectUser)
  const brandChecklists = useBrandChecklists(getActiveTeamId(user)!)

  const getOffice = (deal: IDeal) => {
    let brand: IBrand | null = deal.brand

    do {
      if (brand.brand_type === 'Office') {
        return brand.name
      }

      brand = brand.parent
    } while (brand)

    return 'N/A'
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

  const columns = [
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
      accessor: (deal: IDeal) => getStatus(deal) || '',
      render: ({ row: deal }: { row: IDeal }) => getStatus(deal),
      sortFn: (rows: IDeal[]) => sortDealsStatus(rows, statuses)
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
      render: ({ row: deal }) => (
        <CriticalDate deal={deal} brandChecklists={brandChecklists} />
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
    },
    {
      id: 'creation-time',
      accessor: (deal: IDeal) => deal.created_at
    }
  ]

  const data = useMemo<IDeal[]>(() => {
    if (!deals) {
      return []
    }

    // TODO: Make sure the closings deals do not need these filters
    if (!isClosingsTab) {
      // when user searching something in backoffice, we should show all
      // deals except draft items
      if (searchQuery.term.length > 0) {
        return (Object.values(deals) as IDeal[]).filter(
          (deal: IDeal) => deal.is_draft === false
        )
      }

      if (searchQuery.type === 'inbox') {
        return (Object.values(deals) as IDeal[]).filter(
          (deal: IDeal) =>
            deal.attention_requests > 0 &&
            deal.is_draft === false &&
            deal.inboxes &&
            deal.inboxes.includes(searchQuery.filter)
        )
      }
    }

    return Object.values(deals)
  }, [
    deals,
    searchQuery.filter,
    searchQuery.term.length,
    searchQuery.type,
    isClosingsTab
  ])

  return (
    <Grid<IDeal>
      sorting={{
        columns: SORTABLE_COLUMNS,
        sortBy: getGridSort(user, columns, location, SORT_FIELD_SETTING_KEY)
      }}
      columns={columns}
      rows={data}
      totalRows={data.length}
      virtualize={data.length > 150}
      LoadingStateComponent={LoadingState}
      EmptyStateComponent={ContactsZeroState}
      loading={isLoading ? 'middle' : null}
      classes={{
        row: gridClasses.row
      }}
    />
  )
}

export default withRouter(DealsBackOfficeGrid)
