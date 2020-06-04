import React, { useState } from 'react'

import {
  Button,
  Avatar,
  Tooltip,
  Theme,
  Checkbox,
  makeStyles,
  useTheme
} from '@material-ui/core'

import Flex from 'styled-flex-component'

import { parseSortSetting } from 'utils/sortings/parse-sort-setting'
import { putUserSetting } from 'models/user/put-user-setting'

import { Table } from 'components/Grid/Table'
import { RenderProps } from 'components/Grid/Table/types'
import LoadingContainer from 'components/LoadingContainer'
import IconEmailOutline from 'components/SvgIcons/EmailOutline/IconEmailOutline'
import { useGridContext } from 'components/Grid/Table/hooks/use-grid-context'
import { SELECTION__TOGGLE_ALL } from 'components/Grid/Table/context/constants'
import { getNameInitials } from 'utils/helpers'

import { ListingsListViewDrawer } from './ListingsListViewDrawer'
import { SortableColumns } from './helpers/sortable-columns'
import { TableActions } from './Actions'
import { Caption } from './columns/Caption'

import { IDealAgent } from '../types'

interface Props {
  user: IUser
  data: IDealAgent[]
  deal: IDeal
  isFetching: boolean
}

export const SORT_FIELD_SETTING_KEY = 'grid_deals_agent_network_sort_field'
const useStyles = makeStyles(
  (theme: Theme) => ({
    infoContainer: {
      display: 'inline-block'
    },
    toggleAll: {
      padding: 0,
      marginRight: theme.spacing(1)
    },
    totalRow: {
      display: 'inline-flex',
      marginRight: theme.spacing(2),
      fontSize: theme.typography.overline.fontSize,
      color: theme.palette.grey['500']
    }
  }),
  { name: 'AgentsGrid' }
)

export function Grid(props: Props) {
  const [state, dispatch] = useGridContext()
  const classes = useStyles()
  const theme: Theme = useTheme()
  const [selectedAgent, setSelectedAgent] = useState<null | any>(null)
  const {
    isAllRowsSelected,
    isEntireRowsSelected,
    selectedRowIds,
    excludedRows
  } = state.selection

  const isAllSelected =
    isAllRowsSelected ||
    selectedRowIds.length === (props.data || []).length ||
    (isEntireRowsSelected && excludedRows.length === 0)

  const isSomeRowsSelected =
    (isAllRowsSelected === false &&
      selectedRowIds.length > 0 &&
      selectedRowIds.length < (props.data || []).length) ||
    (isEntireRowsSelected && excludedRows.length > 0)

  const tooltipTitle =
    isAllSelected || isEntireRowsSelected
      ? 'Deselect All Rows'
      : 'Select All Rows'

  const onCloseDrawer = () => setSelectedAgent(null)

  const onSelectAgent = (agent, listType) =>
    setSelectedAgent({
      title: `${agent.name} ${
        listType === 'asListing' ? 'listings' : 'Buyers'
      } (${agent[listType].length})`,
      list: agent[listType].map(id => agent.listings[id])
    })

  const columns = [
    {
      id: 'name',
      header: 'Name',
      width: '20%',
      accessor: (agent: IDealAgent) => agent.name,
      render: ({ row: agent }: RenderProps<IDealAgent>) => (
        <>
          <div>{agent.name}</div>
          <Caption variant="body2">{agent.company}</Caption>
        </>
      )
    },
    {
      id: 'contact',
      width: '10%',
      render: ({ row: agent }: RenderProps<IDealAgent>) => (
        <Tooltip
          title={
            <>
              <div>{agent.email}</div>
              <div>{agent.phone}</div>
            </>
          }
        >
          <Flex alignCenter justifyCenter>
            <IconEmailOutline />
          </Flex>
        </Tooltip>
      )
    },
    {
      id: 'listings',
      accessor: (agent: IDealAgent) => agent.asListing.length,
      render: ({ row: agent }: RenderProps<IDealAgent>) => (
        <Flex alignCenter>
          <Caption># of Listings:&nbsp;</Caption>
          {agent.asListing.length > 0 ? (
            <Button
              size="small"
              style={{
                minWidth: 'unset'
              }}
              onClick={() => onSelectAgent(agent, 'asListing')}
            >
              {agent.asListing.length}
            </Button>
          ) : (
            '0'
          )}
        </Flex>
      )
    },
    {
      id: 'buyers',
      accessor: (agent: IDealAgent) => agent.asBuyers.length,
      render: ({ row: agent }: RenderProps<IDealAgent>) => (
        <Flex alignCenter>
          <Caption># of Buyers:&nbsp;</Caption>
          {agent.asBuyers.length > 0 ? (
            <Button
              size="small"
              style={{
                minWidth: 'unset'
              }}
              onClick={() => onSelectAgent(agent, 'asBuyers')}
            >
              {agent.asBuyers.length}
            </Button>
          ) : (
            '0'
          )}
        </Flex>
      )
    },
    {
      id: 'value_in',
      accessor: (agent: IDealAgent) => agent.listingsTotalVolume,
      render: ({ row: agent }: RenderProps<IDealAgent>) => (
        <Flex>
          <Caption>Volume in $:&nbsp;</Caption>
          {agent.listingsTotalVolume > 0
            ? `$${agent.listingsTotalVolume.toLocaleString()}`
            : 0}
        </Flex>
      )
    },
    {
      id: 'avg_price',
      accessor: (agent: IDealAgent) => agent.listingsAveragePrice,
      render: ({ row: agent }: RenderProps<IDealAgent>) => (
        <Flex>
          <Caption>Avg Price:&nbsp;</Caption>
          {agent.listingsAveragePrice > 0
            ? `$${agent.listingsAveragePrice.toLocaleString()}`
            : 0}
        </Flex>
      )
    }
  ]

  const getActiveSort = () => {
    const sort = parseSortSetting(
      props.user,
      SORT_FIELD_SETTING_KEY,
      '-listings'
    )

    return SortableColumns.find(col => col.value === sort.id)
  }

  const handleChangeSort = async column => {
    putUserSetting(SORT_FIELD_SETTING_KEY, column.value)
  }

  const toggleAll = () =>
    dispatch({
      type: SELECTION__TOGGLE_ALL,
      rows: props.data
    })

  const getSummeryInfo = () => {
    const totalRows = (props.data || []).length
    let selectedCount

    if (isEntireRowsSelected) {
      selectedCount = totalRows - excludedRows.length
    } else if (selectedRowIds.length > 0) {
      selectedCount = selectedRowIds.length
    }

    return selectedCount
      ? `${selectedCount} of ${totalRows} selected`
      : `${totalRows} Agents`
  }

  return (
    <>
      {!props.isFetching && (props.data || []).length > 0 && (
        <div className={classes.infoContainer}>
          <Tooltip title={tooltipTitle}>
            <Checkbox
              disableRipple
              className={classes.toggleAll}
              checked={isAllSelected}
              indeterminate={isSomeRowsSelected}
              onChange={toggleAll}
            />
          </Tooltip>
          <span className={classes.totalRow}>{getSummeryInfo()}</span>
        </div>
      )}

      <Table<IDealAgent>
        rows={props.data}
        columns={columns}
        totalRows={(props.data || []).length}
        LoadingStateComponent={() => (
          <LoadingContainer style={{ padding: 0 }} />
        )}
        loading={props.isFetching ? 'top' : null}
        sorting={{
          defaultSort: getActiveSort(),
          columns: SortableColumns,
          onChange: handleChangeSort
        }}
        selection={{
          columnProps: {
            width: `${theme.spacing(7.5)}px`
          },
          defaultRender: ({ row }: RenderProps<IDealAgent>) => {
            return (
              <Avatar alt={row.name}>{getNameInitials(row.name, 1)}</Avatar>
            )
          },
          showSelectAll: false
        }}
        TableActions={<TableActions rows={props.data} deal={props.deal} />}
      />

      {selectedAgent && (
        <ListingsListViewDrawer
          isOpen
          title={selectedAgent.title}
          onClose={onCloseDrawer}
          listings={selectedAgent.list}
        />
      )}
    </>
  )
}
