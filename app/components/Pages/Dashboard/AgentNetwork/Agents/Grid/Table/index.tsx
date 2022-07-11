import { Typography, Button, Tooltip, Theme, useTheme } from '@material-ui/core'
import { mdiEmailOutline } from '@mdi/js'
import Flex from 'styled-flex-component'

import { useUnsafeActiveTeam } from '@app/hooks/team/use-unsafe-active-team'
import { AgentWithStats } from '@app/models/agent-network/get-agents'
import { Avatar } from 'components/Avatar'
import { Table } from 'components/Grid/Table'
import { SortableColumn, RenderProps } from 'components/Grid/Table/types'
import LoadingContainer from 'components/LoadingContainer'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { putUserSetting } from 'models/user/put-user-setting'
import { getNameInitials } from 'utils/helpers'
import { parseSortSetting } from 'utils/sortings/parse-sort-setting'

import { AgentSide, ListingWithProposedAgent } from '../../types'
import { TableActions } from '../Actions'
import { Caption } from '../columns/Caption'
import { SortableColumns } from '../helpers/sortable-columns'
import { TableToolbar } from '../Toolbar'

const SORT_FIELD_SETTING_KEY = 'grid_deals_agent_network_sort_field'

interface Props {
  user: IUser
  listing: Nullable<ListingWithProposedAgent>
  agents: Nullable<AgentWithStats[]>
  isLoading: boolean
  onSelectAgentInfo: (info: AgentWithStats, side: AgentSide) => void
}

export function ListTable({
  user,
  listing,
  agents,
  isLoading,
  onSelectAgentInfo
}: Props) {
  const theme: Theme = useTheme()
  const activeTeam = useUnsafeActiveTeam()

  const columns = [
    {
      id: 'name',
      header: 'Name',
      width: '20%',
      accessor: (agentData: AgentWithStats) => agentData.full_name,
      render: ({ row: agentData }: RenderProps<AgentWithStats>) => (
        <Typography noWrap>
          {agentData.full_name}
          {agentData.office?.name && (
            <Caption variant="body2">{agentData.office?.name}</Caption>
          )}
        </Typography>
      )
    },
    {
      id: 'contact',
      width: '10%',
      render: ({ row: agentData }: RenderProps<AgentWithStats>) => (
        <Tooltip
          title={
            <>
              <div>{agentData.email}</div>
              <div>{agentData.phone_number}</div>
            </>
          }
        >
          <Flex alignCenter justifyCenter>
            <SvgIcon path={mdiEmailOutline} />
          </Flex>
        </Tooltip>
      )
    },
    {
      id: 'listings',
      accessor: (agentData: AgentWithStats) => agentData.stats.listing,
      render: ({ row: agentData }: RenderProps<AgentWithStats>) => (
        <Flex alignCenter>
          <Caption># of Listings:&nbsp;</Caption>
          {agentData.stats.listing > 0 ? (
            <Button
              size="small"
              style={{
                minWidth: 'unset'
              }}
              onClick={() => onSelectAgentInfo(agentData, 'list-agent')}
            >
              {agentData.stats.listing}
            </Button>
          ) : (
            '0'
          )}
        </Flex>
      )
    },
    {
      id: 'buyers',
      accessor: (agentData: AgentWithStats) => agentData.stats.selling,
      render: ({ row: agentData }: RenderProps<AgentWithStats>) => (
        <Flex alignCenter>
          <Caption># of Buyers:&nbsp;</Caption>
          {agentData.stats.selling > 0 ? (
            <Button
              size="small"
              style={{
                minWidth: 'unset'
              }}
              onClick={() => onSelectAgentInfo(agentData, 'selling-agent')}
            >
              {agentData.stats.selling}
            </Button>
          ) : (
            '0'
          )}
        </Flex>
      )
    },
    {
      id: 'value_in',
      accessor: (agentData: AgentWithStats) => agentData.stats.volume_in,
      render: ({ row: agentData }: RenderProps<AgentWithStats>) => (
        <Flex alignCenter>
          <Caption>Volume in $:&nbsp;</Caption>
          {agentData.stats.volume_in > 0
            ? `$${agentData.stats.volume_in.toLocaleString()}`
            : 0}
        </Flex>
      )
    },
    {
      id: 'avg_price',
      accessor: (agentData: AgentWithStats) => agentData.stats.avg_price,
      render: ({ row: agentData }: RenderProps<AgentWithStats>) => (
        <Flex alignCenter>
          <Caption>Avg Price:&nbsp;</Caption>
          {agentData.stats.avg_price > 0
            ? `$${agentData.stats.avg_price.toLocaleString()}`
            : 0}
        </Flex>
      )
    }
  ]

  const getActiveSort = () => {
    const sort = parseSortSetting(
      activeTeam,
      SORT_FIELD_SETTING_KEY,
      '-listings'
    )

    return SortableColumns.find(
      col => col.value === sort.id && col.ascending === sort.ascending
    )
  }

  const handleChangeSort = async (column: SortableColumn) => {
    putUserSetting(
      SORT_FIELD_SETTING_KEY,
      column.ascending ? column.value : `-${column.value}`
    )
  }

  return (
    <Table<AgentWithStats>
      rows={agents ?? []}
      columns={columns}
      totalRows={(agents || []).length}
      LoadingStateComponent={() => <LoadingContainer noPaddings />}
      loading={isLoading ? 'top' : null}
      sorting={{
        defaultSort: getActiveSort(),
        columns: SortableColumns,
        onChange: handleChangeSort
      }}
      selection={{
        columnProps: {
          width: `${theme.spacing(7.5)}px`
        },
        defaultRender: ({ row: agentData }: RenderProps<AgentWithStats>) => {
          return (
            <Avatar alt={agentData.full_name} url="">
              {getNameInitials(agentData.full_name, 1)}
            </Avatar>
          )
        },
        showSelectAll: true
      }}
      TableActions={
        <TableActions user={user} listing={listing} agents={agents} />
      }
      ToolbarComponent={<TableToolbar rows={agents ?? []} />}
    />
  )
}
