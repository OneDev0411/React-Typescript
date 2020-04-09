import React from 'react'

import { Button, Avatar, Theme } from '@material-ui/core'

import { withTheme } from '@material-ui/styles'

import { parseSortSetting } from 'utils/sortings/parse-sort-setting'
import { putUserSetting } from 'models/user/put-user-setting'

import Table from 'components/Grid/Table'

import { RenderProps } from 'components/Grid/Table/types'

import { StateContext } from 'components/Grid/Table/context'

import LoadingContainer from 'components/LoadingContainer'

import { Company } from './columns/Company'
import { ContactInfo } from './columns/ContactInfo'
import { ListingsListViewDrawer } from './ListingsListViewDrawer'

import { SortableColumns } from './helpers/sortable-columns'

import { TableActions } from './Actions'

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
      accessor: (agent: IDealAgent) => agent.name
    },
    {
      id: 'company',
      header: 'Company',
      width: '10%',
      accessor: (agent: IDealAgent) => agent.company,
      render: ({ row: agent }: RenderProps<IDealAgent>) => (
        <Company name={agent.company} />
      )
    },
    {
      id: 'listings',
      header: '# of Listings',
      width: '10%',
      accessor: (agent: IDealAgent) => agent.asListing.length,
      render: ({ row: agent }: RenderProps<IDealAgent>) =>
        agent.asListing.length > 0 ? (
          <Button onClick={() => this.onSelectAgent(agent, 'asListing')}>
            {agent.asListing.length}
          </Button>
        ) : (
          '0'
        )
    },
    {
      id: 'buyers',
      header: '# of Buyers',
      width: '10%',
      accessor: (agent: IDealAgent) => agent.asBuyers.length,
      render: ({ row: agent }: RenderProps<IDealAgent>) =>
        agent.asBuyers.length > 0 ? (
          <Button onClick={() => this.onSelectAgent(agent, 'asBuyers')}>
            {agent.asBuyers.length}
          </Button>
        ) : (
          '0'
        )
    },
    {
      id: 'value_in',
      header: 'Volume in $',
      width: '10%',
      accessor: (agent: IDealAgent) => agent.listingsTotalVolume,
      render: ({ row: agent }: RenderProps<IDealAgent>) =>
        agent.listingsTotalVolume > 0
          ? `$${agent.listingsTotalVolume.toLocaleString()}`
          : 0
    },
    {
      id: 'avg_price',
      header: 'Avg Price',
      width: '10%',
      accessor: (agent: IDealAgent) => agent.listingsAveragePrice,
      render: ({ row: agent }: RenderProps<IDealAgent>) =>
        agent.listingsAveragePrice > 0
          ? `$${agent.listingsAveragePrice.toLocaleString()}`
          : 0
    },
    {
      id: 'email',
      header: 'Contact Info',
      sortable: false,
      accessor: (agent: IDealAgent) => agent.email,
      render: ({ row: agent }) => <ContactInfo agent={agent} />
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

    return (
      <>
        <Table<IDealAgent>
          rows={this.props.data}
          columns={this.columns}
          totalRows={(this.props.data || []).length}
          LoadingStateComponent={() => (
            <LoadingContainer style={{ padding: 0 }} />
          )}
          loading={this.props.isFetching ? 'top' : null}
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
              return <Avatar alt={row.name}>{row.name && row.name[0]}</Avatar>
            }
          }}
          TableActions={({
            state,
            rows
          }: {
            state: StateContext
            rows: IDealAgent[]
          }) => (
            <TableActions rows={rows} state={state} deal={this.props.deal} />
          )}
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
