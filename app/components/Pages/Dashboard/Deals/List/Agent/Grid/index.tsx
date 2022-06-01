import { TableCellProps } from '@material-ui/core'
import { useSelector } from 'react-redux'
import { withRouter, WithRouterProps } from 'react-router'

import { useActiveTeam } from '@app/hooks/team/use-active-team'
import { useBrandChecklists } from '@app/hooks/use-brand-checklists'
import { useMakeOriginQueryParamFromLocation } from '@app/hooks/use-make-origin-query-param-from-location'
import { goTo } from '@app/utils/go-to'
import { useGridStyles } from '@app/views/components/Grid/Table/styles/default'
import Grid from 'components/Grid/Table'
import {
  TrProps,
  SortableColumn,
  ColumnSortType
} from 'components/Grid/Table/types'
import { useBrandStatuses } from 'hooks/use-brand-statuses'
import {
  getStatus,
  getField,
  getFormattedPrice
} from 'models/Deal/helpers/context'
import { IAppState } from 'reducers'
import { sortDealsStatus } from 'utils/sort-deals-status'

import onDealOpened from '../../../utils/on-deal-opened'
import { getPrimaryAgent, getPrimaryAgentName } from '../../../utils/roles'
import LoadingState from '../../components/LoadingState'
import { Address } from '../../components/table-columns/Address'
import AgentAvatars from '../../components/table-columns/AgentAvatars'
import CriticalDate, {
  getCriticalDateNextValue
} from '../../components/table-columns/CriticalDate'
import { getGridSort } from '../../helpers/sorting'
import useDealsListsLuckyMode from '../../hooks/use-deals-lists-lucky-mode'
import { SORT_FIELD_SETTING_KEY } from '../helpers/agent-sorting'
import { useDealsList } from '../hooks/use-deals-list'

import EmptyState from './EmptyState'

interface Props {
  sortableColumns: SortableColumn[]
  activeFilter: string
  isSearching: boolean
}

function AgentGrid(props: Props & WithRouterProps) {
  const gridClasses = useGridStyles()
  const activeTeam = useActiveTeam()
  const activeBrandId = activeTeam?.brand?.id

  const isFetchingDeals = useSelector(
    ({ deals }: IAppState) => deals.properties.isFetchingDeals
  )
  const roles = useSelector(({ deals }: IAppState) => deals.roles)
  const brandChecklists = useBrandChecklists(activeBrandId)

  const [statuses] = useBrandStatuses(activeBrandId)
  const originQueryParam = useMakeOriginQueryParamFromLocation()
  const getDealsList = useDealsList()

  const data = getDealsList(props.activeFilter)

  const getRowProps = ({ row: deal }: TrProps<IDeal>) => {
    return {
      onClick: () => {
        goTo(`/dashboard/deals/${deal.id}?${originQueryParam}`)
        onDealOpened()
      }
    }
  }

  const columns = [
    {
      id: 'address',
      width: '30%',
      accessor: (deal: IDeal) => deal.title,
      render: ({ row: deal, totalRows, rowIndex }) => (
        <Address
          deal={deal}
          roles={roles}
          totalRows={totalRows}
          rowIndex={rowIndex}
          notificationsCount={
            deal.new_notifications ? deal.new_notifications.length : 0
          }
          originQueryParam={originQueryParam}
        />
      )
    },
    {
      id: 'status',
      width: '15%',
      class: 'opaque',
      accessor: (deal: IDeal) => getStatus(deal) || '',
      render: ({ row: deal }: { row: IDeal }) => getStatus(deal),
      sortFn: (rows: IDeal[]) => sortDealsStatus(rows, statuses)
    },
    {
      id: 'price',
      sortType: 'number' as ColumnSortType,
      width: '10%',
      class: 'opaque',
      accessor: (deal: IDeal) => getPriceValue(deal),
      render: ({ row: deal }: { row: IDeal }) =>
        getFormattedPrice(getPriceValue(deal), 'currency', 0)
    },
    {
      id: 'critical-dates',
      width: '20%',
      class: 'opaque',
      accessor: (deal: IDeal) => getCriticalDateNextValue(deal),
      render: ({ row: deal }) => (
        <CriticalDate deal={deal} brandChecklists={brandChecklists} />
      )
    },
    {
      id: 'agent-name',
      width: '10%',
      class: 'opaque',
      align: 'right' as TableCellProps['align'],
      accessor: (deal: IDeal) => getPrimaryAgentName(deal, roles),
      render: ({ row: deal }: { row: IDeal }) => {
        return <AgentAvatars agent={getPrimaryAgent(deal, roles)} />
      }
    }
  ]

  useDealsListsLuckyMode(data, isFetchingDeals)

  return (
    <>
      {data.length === 0 && !isFetchingDeals ? (
        <EmptyState isSearching={props.isSearching} />
      ) : (
        <Grid<IDeal>
          sorting={{
            columns: props.sortableColumns,
            sortBy: getGridSort(
              activeTeam,
              columns,
              props.location,
              SORT_FIELD_SETTING_KEY
            )
          }}
          columns={columns}
          rows={data}
          totalRows={data.length}
          virtualize={data.length > 30}
          LoadingStateComponent={LoadingState}
          loading={isFetchingDeals ? 'middle' : null}
          getTrProps={getRowProps}
          classes={{
            row: gridClasses.row
          }}
        />
      )}
    </>
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
