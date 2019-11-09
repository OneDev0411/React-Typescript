import React from 'react'

import Loading from 'components/Spinner'
import Table from 'components/Grid/Table'
import Button from 'components/Button/ActionButton'
import SendDealPromotionCard from 'components/InstantMarketing/adapters/SendDealPromotion'

import { Name } from './columns/Name'
import { Company } from './columns/Company'
import { ContactInfo } from './columns/ContactInfo'
import { ListingsListViewDrawer } from './ListingsListViewDrawer'

const buttonStyle = {
  padding: '0.25rem 0 1rem',
  height: 'auto',
  lineHeight: 1,
  width: '100%'
}

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

  getRecipients = (
    selectedRows: UUID[]
  ): IDenormalizedEmailRecipientDealAgentInput[] => {
    const { data } = this.props

    if (
      Array.isArray(data) === false ||
      Array.isArray(selectedRows) === false ||
      data.length === 0 ||
      selectedRows.length === 0
    ) {
      return []
    }

    return data
      .filter(
        agent => agent.agentId && selectedRows.includes(agent.id) && agent.email
      )
      .map(agent => ({
        recipient_type: 'Agent',
        agent
      }))
  }

  columns = [
    {
      id: 'name',
      header: 'Name',
      width: '20%',
      accessor: agent => agent.name,
      render: ({ rowData: agent }) => <Name name={agent.name} />
    },
    {
      id: 'company',
      header: 'Company',
      width: '17%',
      accessor: agent => agent.company,
      render: ({ rowData: agent }) => <Company name={agent.company} />
    },
    {
      id: 'listings',
      header: '# of Listings',
      accessor: agent => agent.asListing.length,
      render: ({ rowData: agent }) =>
        agent.asListing.length > 0 ? (
          <Button
            appearance="link"
            style={buttonStyle}
            onClick={() => this.onSelectAgent(agent, 'asListing')}
          >
            {agent.asListing.length}
          </Button>
        ) : (
          '0'
        )
    },
    {
      id: 'buyers',
      header: '# of Buyers',
      accessor: agent => agent.asBuyers.length,
      render: ({ rowData: agent }) =>
        agent.asBuyers.length > 0 ? (
          <Button
            appearance="link"
            style={buttonStyle}
            onClick={() => this.onSelectAgent(agent, 'asBuyers')}
          >
            {agent.asBuyers.length}
          </Button>
        ) : (
          '0'
        )
    },
    {
      id: 'value_in',
      header: 'Volume in $',
      accessor: agent => agent.listingsTotalVolume,
      render: ({ rowData: agent }) =>
        agent.listingsTotalVolume > 0
          ? `$${agent.listingsTotalVolume.toLocaleString()}`
          : 0
    },
    {
      id: 'avg_price',
      header: 'Avg Price',
      accessor: agent => agent.listingsAveragePrice,
      render: ({ rowData: agent }) =>
        agent.listingsAveragePrice > 0
          ? `$${agent.listingsAveragePrice.toLocaleString()}`
          : 0
    },
    {
      id: 'email',
      header: 'Contact Info',
      width: '23%',
      sortable: false,
      accessor: agent => agent.email,
      render: ({ rowData: agent }) => <ContactInfo agent={agent} />
    }
  ]

  actions = [
    {
      display: props => props.selectedRows.length > 0,
      render: props => (
        /*
        // @ts-ignore because SendDealPromotionCard is not yet migrated to ts */
        <SendDealPromotionCard
          deal={this.props.deal}
          recipients={this.getRecipients(props.selectedRows)}
          selectedRows={props.selectedRows}
          mediums="Email"
          types={[
            'OpenHouse',
            'JustSold',
            'ComingSoon',
            'JustListed',
            'PriceImprovement'
          ]}
        >
          Promote Listing
        </SendDealPromotionCard>
      )
    }
  ]

  render() {
    const { selectedAgent } = this.state

    return (
      <div style={{ padding: '0 1.5em' }}>
        <Table
          data={this.props.data}
          columns={this.columns}
          LoadingState={Loading}
          isFetching={this.props.isFetching}
          summary={{ entityName: 'Agents' }}
          plugins={{
            sortable: {},
            selectable: {
              persistent: true,
              storageKey: 'agent_network'
            },
            actionable: {
              actions: this.actions
            }
          }}
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
