import React from 'react'

import { Button, Avatar, Tooltip, Theme } from '@material-ui/core'

import { withTheme } from '@material-ui/styles'

import Flex from 'styled-flex-component'

import { parseSortSetting } from 'utils/sortings/parse-sort-setting'
import { putUserSetting } from 'models/user/put-user-setting'

import Table from 'components/Grid/Table'
import { RenderProps } from 'components/Grid/Table/types'
import LoadingContainer from 'components/LoadingContainer'
import IconEmailOutline from 'components/SvgIcons/EmailOutline/IconEmailOutline'

import { getNameInitials } from 'utils/helpers'

import { ListingsListViewDrawer } from './ListingsListViewDrawer'
import { SortableColumns } from './helpers/sortable-columns'
import { TableActions } from './Actions'
import { Caption } from './columns/Caption'

import { IDealAgent } from '../types'

interface State {
  selectedAgent: null | any
}
interface Props {
  user: IUser
  data: IDealAgent[]
  deal: IDeal
  isFetching: boolean
}

export const SORT_FIELD_SETTING_KEY = 'grid_deals_agent_network_sort_field'

class Grid extends React.Component<
  Props & {
    theme: Theme
  },
  State
> {
  constructor(props) {
    super(props)

    this.state = {
      selectedAgent: null
    }
  }

  onCloseDrawer = () => this.setState({ selectedAgent: null })

  onSelectAgent = (agent, listType) =>
    this.setState({
      selectedAgent: {
        title: `${agent.name} ${
          listType === 'asListing' ? 'listings' : 'Buyers'
        } (${agent[listType].length})`,
        list: agent[listType].map(id => agent.listings[id])
      }
    })

  columns = [
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
              onClick={() => this.onSelectAgent(agent, 'asListing')}
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
              onClick={() => this.onSelectAgent(agent, 'asBuyers')}
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

  getActiveSort = () => {
    const sort = parseSortSetting(
      this.props.user,
      SORT_FIELD_SETTING_KEY,
      'name'
    )

    return SortableColumns.find(col => col.value === sort.id)
  }

  handleChangeSort = async column => {
    putUserSetting(SORT_FIELD_SETTING_KEY, column.value)
  }

  render() {
    const { selectedAgent } = this.state
    const totalRows = (this.props.data || []).length

    return (
      <>
        <Table<IDealAgent>
          rows={this.props.data}
          columns={this.columns}
          totalRows={totalRows}
          virtualize={totalRows > 150}
          LoadingStateComponent={() => (
            <LoadingContainer style={{ padding: 0 }} />
          )}
          loading={this.props.isFetching ? 'middle' : null}
          summary={total => `${total} Agents`}
          sorting={{
            defaultSort: this.getActiveSort(),
            columns: SortableColumns,
            onChange: this.handleChangeSort
          }}
          selection={{
            columnProps: {
              width: `${this.props.theme.spacing(7.5)}px`
            },
            defaultRender: ({ row }: RenderProps<IDealAgent>) => {
              return (
                <Avatar alt={row.name}>{getNameInitials(row.name, 1)}</Avatar>
              )
            }
          }}
          TableActions={
            <TableActions rows={this.props.data} deal={this.props.deal} />
          }
        />

        {selectedAgent && (
          <ListingsListViewDrawer
            isOpen
            title={selectedAgent.title}
            onClose={this.onCloseDrawer}
            listings={selectedAgent.list}
          />
        )}
      </>
    )
  }
}

export default withTheme(Grid)
