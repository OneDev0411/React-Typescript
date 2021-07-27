import { useMemo } from 'react'

import { TableCellProps } from '@material-ui/core'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { WithRouterProps, withRouter } from 'react-router'

import { useBrandChecklists } from '@app/hooks/use-brand-checklists'
import { goTo } from '@app/utils/go-to'
import { getActiveTeamId } from '@app/utils/user-teams'
import { TrProps } from '@app/views/components/Grid/Table/types'
import Grid from 'components/Grid/Table'
import { useGridStyles } from 'components/Grid/Table/styles'
import { getGridSort } from 'deals/List/helpers/sorting'
import {
  getStatus,
  getFormattedPrice,
  getPrice
} from 'models/Deal/helpers/context'
import { IAppState } from 'reducers'
import { selectUser } from 'selectors/user'
import { sortDealsStatus } from 'utils/sort-deals-status'

import onDealOpened from '../../../utils/on-deal-opened'
import { getPrimaryAgentName } from '../../../utils/roles'
import LoadingState from '../../components/LoadingState'
import { Address } from '../../components/table-columns/Address'
import CriticalDate, {
  getCriticalDateNextValue
} from '../../components/table-columns/CriticalDate'
import useDealsListsLuckyMode from '../../hooks/use-deals-lists-lucky-mode'
import {
  SORTABLE_COLUMNS,
  SORT_FIELD_SETTING_KEY
} from '../helpers/backoffice-sorting'
import { SearchQuery } from '../types'

import { ContactsZeroState } from './ZeroState'

interface Props {
  searchQuery: SearchQuery
  statuses: IDealStatus[]
}

function BackOfficeGrid(props: Props & WithRouterProps) {
  const gridClasses = useGridStyles()

  const isFetchingDeals = useSelector(
    ({ deals }: IAppState) => deals.properties.isFetchingDeals
  )
  const deals = useSelector(({ deals }: IAppState) => deals.list)
  const roles = useSelector(({ deals }: IAppState) => deals.roles)
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
      sortFn: (rows: IDeal[]) => sortDealsStatus(rows, props.statuses)
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

  const getRowProps = ({ row: deal }: TrProps<IDeal>) => {
    return {
      onClick: () => {
        goTo(`/dashboard/deals/${deal.id}`)
        onDealOpened()
      }
    }
  }

  const data = useMemo<IDeal[]>(() => {
    if (!deals) {
      return []
    }

    /**
     * when user searching something in backoffice and he is not on the closings tab,
     * we should show all deals except draft items
     */
    if (
      // TODO: find another solution for this to do not hard code this kind of logic
      // here
      props.searchQuery.filter !== 'closings' &&
      props.searchQuery.term.length > 0
    ) {
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
  }, [
    deals,
    props.searchQuery.filter,
    props.searchQuery.term.length,
    props.searchQuery.type
  ])

  useDealsListsLuckyMode(data, isFetchingDeals)

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
      EmptyStateComponent={ContactsZeroState}
      loading={isFetchingDeals ? 'middle' : null}
      getTrProps={getRowProps}
      classes={{
        row: gridClasses.row
      }}
    />
  )
}

export default withRouter(BackOfficeGrid)
