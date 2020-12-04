import React from 'react'

import { Button, Tooltip, Theme, useTheme } from '@material-ui/core'
import Flex from 'styled-flex-component'
import { mdiEmailOutline } from '@mdi/js'

import { parseSortSetting } from 'utils/sortings/parse-sort-setting'
import { putUserSetting } from 'models/user/put-user-setting'

import { getNameInitials } from 'utils/helpers'

import { Table } from 'components/Grid/Table'
import { SortableColumn } from 'components/Grid/Table/types'
import { RenderProps } from 'components/Grid/Table/types'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { Avatar } from 'components/Avatar'
import LoadingContainer from 'components/LoadingContainer'

import { SortableColumns } from '../helpers/sortable-columns'
import { Caption } from '../columns/Caption'

import { TableActions } from '../Actions'
import { TableToolbar } from '../Toolbar'

import {
  AggregatedAgentInfo,
  AgentSide,
  ListingWithProposedAgent
} from '../../types'

const SORT_FIELD_SETTING_KEY = 'grid_deals_agent_network_sort_field'

interface Props {
  user: IUser
  listing: Nullable<ListingWithProposedAgent>
  agents: Nullable<AggregatedAgentInfo[]>
  isLoading: boolean
  onSelectAgentInfo: (info: AggregatedAgentInfo, side: AgentSide) => void
}

export function ListTable({
  user,
  listing,
  agents,
  isLoading,
  onSelectAgentInfo
}: Props) {
  const theme: Theme = useTheme()

  const columns = [
    {
      id: 'name',
      header: 'Name',
      width: '20%',
      accessor: (agentData: AggregatedAgentInfo) => agentData.agent.full_name,
      render: ({ row: agentData }: RenderProps<AggregatedAgentInfo>) => (
        <div>{agentData.agent.full_name}</div>
      )
    },
    {
      id: 'contact',
      width: '10%',
      render: ({ row: agentData }: RenderProps<AggregatedAgentInfo>) => (
        <Tooltip
          title={
            <>
              <div>{agentData.agent.email}</div>
              <div>{agentData.agent.phone_number}</div>
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
      accessor: (agentData: AggregatedAgentInfo) =>
        agentData.listingsAsListAgent.length,
      render: ({ row: agentData }: RenderProps<AggregatedAgentInfo>) => (
        <Flex alignCenter>
          <Caption># of Listings:&nbsp;</Caption>
          {agentData.listingsAsListAgent.length > 0 ? (
            <Button
              size="small"
              style={{
                minWidth: 'unset'
              }}
              onClick={() => onSelectAgentInfo(agentData, 'list-agent')}
            >
              {agentData.listingsAsListAgent.length}
            </Button>
          ) : (
            '0'
          )}
        </Flex>
      )
    },
    {
      id: 'buyers',
      accessor: (agentData: AggregatedAgentInfo) =>
        agentData.listingsAsSellingAgent.length,
      render: ({ row: agentData }: RenderProps<AggregatedAgentInfo>) => (
        <Flex alignCenter>
          <Caption># of Buyers:&nbsp;</Caption>
          {agentData.listingsAsSellingAgent.length > 0 ? (
            <Button
              size="small"
              style={{
                minWidth: 'unset'
              }}
              onClick={() => onSelectAgentInfo(agentData, 'selling-agent')}
            >
              {agentData.listingsAsSellingAgent.length}
            </Button>
          ) : (
            '0'
          )}
        </Flex>
      )
    },
    {
      id: 'value_in',
      accessor: (agentData: AggregatedAgentInfo) => agentData.stats.totalVolume,
      render: ({ row: agentData }: RenderProps<AggregatedAgentInfo>) => (
        <Flex alignCenter>
          <Caption>Volume in $:&nbsp;</Caption>
          {agentData.stats.totalVolume > 0
            ? `$${agentData.stats.totalVolume.toLocaleString()}`
            : 0}
        </Flex>
      )
    },
    {
      id: 'avg_price',
      accessor: (agentData: AggregatedAgentInfo) =>
        agentData.stats.averagePrice,
      render: ({ row: agentData }: RenderProps<AggregatedAgentInfo>) => (
        <Flex alignCenter>
          <Caption>Avg Price:&nbsp;</Caption>
          {agentData.stats.averagePrice > 0
            ? `$${agentData.stats.averagePrice.toLocaleString()}`
            : 0}
        </Flex>
      )
    }
  ]

  const getActiveSort = () => {
    const sort = parseSortSetting(user, SORT_FIELD_SETTING_KEY, '-listings')

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
    <Table<AggregatedAgentInfo>
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
        defaultRender: ({
          row: agentData
        }: RenderProps<AggregatedAgentInfo>) => {
          return (
            <Avatar alt={agentData.agent.full_name} url="">
              {getNameInitials(agentData.agent.full_name, 1)}
            </Avatar>
          )
        },
        showSelectAll: true
      }}
      TableActions={
        <TableActions user={user} listing={listing} agents={agents} />
      }
      ToolbarComponent={<TableToolbar />}
    />
  )
}
