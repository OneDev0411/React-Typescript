import React from 'react'

import { Button } from '@material-ui/core'

import Avatar from 'components/Avatar'
import Loading from 'components/Spinner'
import Table from 'components/Grid/Table'

import { RenderProps } from 'components/Grid/Table/types'

import { StateContext } from 'components/Grid/Table/context'

import { Company } from './columns/Company'
import { ContactInfo } from './columns/ContactInfo'
import { ListingsListViewDrawer } from './ListingsListViewDrawer'

import { TableActions } from './Actions'

import { IDealAgent } from '../types'

interface State {
  selectedAgent: null | any
}
interface Props {
  data: IDealAgent[]
  deal: IDeal
  isFetching: boolean
}

export class Grid extends React.Component<Props, State> {
  state: State = {
    selectedAgent: null
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
      accessor: (agent: IDealAgent) => agent.name
    },
    {
      id: 'company',
      header: 'Company',
      width: '17%',
      accessor: (agent: IDealAgent) => agent.company,
      render: ({ row: agent }: RenderProps<IDealAgent>) => (
        <Company name={agent.company} />
      )
    },
    {
      id: 'listings',
      header: '# of Listings',
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
      accessor: (agent: IDealAgent) => agent.listingsTotalVolume,
      render: ({ row: agent }: RenderProps<IDealAgent>) =>
        agent.listingsTotalVolume > 0
          ? `$${agent.listingsTotalVolume.toLocaleString()}`
          : 0
    },
    {
      id: 'avg_price',
      header: 'Avg Price',
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

  render() {
    const { selectedAgent } = this.state

    return (
      <div style={{ padding: '0 1.5em' }}>
        <Table<IDealAgent>
          rows={this.props.data}
          columns={this.columns}
          totalRows={(this.props.data || []).length}
          LoadingState={Loading}
          loading={this.props.isFetching ? 'middle' : null}
          summary={total => `${total} Agents`}
          selection={{
            defaultRender: ({ row }: RenderProps<IDealAgent>) => {
              return <Avatar title={row.name} />
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
      </div>
    )
  }
}
