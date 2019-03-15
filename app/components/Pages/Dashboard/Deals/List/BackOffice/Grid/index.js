import React from 'react'
import { connect } from 'react-redux'

import merge from 'merge'
import moment from 'moment'

import Deal from 'models/Deal'

import Table from 'components/Grid/Table'

import EmptyState from './EmptyState'
import LoadingState from '../../components/LoadingState'

import Address from '../../components/table-columns/Address'
import Notifications from '../../components/table-columns/NotificationBadge'

import { getPrimaryAgentName } from '../../../utils/roles'

class Grid extends React.Component {
  get Columns() {
    const { roles } = this.props

    return [
      {
        id: 'address',
        header: 'Address',
        width: '25%',
        verticalAlign: 'center',
        accessor: deal => Deal.get.address(deal, roles),
        render: ({ rowData: deal }) => <Address deal={deal} />
      },
      {
        id: 'agent-name',
        header: 'Agent Name',
        accessor: deal => getPrimaryAgentName(deal, roles),
        render: ({ rowData: deal }) => getPrimaryAgentName(deal, roles)
      },
      {
        id: 'office',
        header: 'Office',
        accessor: deal => this.getOffice(deal),
        render: ({ rowData: deal }) => this.getOffice(deal)
      },
      {
        id: 'submitted-at',
        header: 'Submitted At',
        accessor: 'attention_requested_at',
        render: ({ rowData: deal }) =>
          this.getSubmitTime(deal.attention_requested_at)
      },
      {
        id: 'notification',
        header: '',
        width: '50px',
        verticalAlign: 'center',
        render: ({ rowData: deal }) => (
          <Notifications
            count={deal.attention_requests}
            caption="$count tasks need your attention"
          />
        )
      }
    ]
  }

  get Data() {
    const { deals, activeFilter, searchCriteria } = this.props

    if (!deals) {
      return []
    }

    // when user searching something in backoffice, we should show all
    // deals except draft items
    if (searchCriteria.length > 0) {
      return Object.values(deals).filter(deal => deal.is_draft === false)
    }

    return Object.values(deals).filter(
      deal =>
        deal.attention_requests > 0 &&
        deal.is_draft === false &&
        deal.inboxes &&
        deal.inboxes.includes(activeFilter)
    )
  }

  getOffice = deal => {
    const brand = this.flattenBrand(deal.brand)

    return brand && brand.messages ? brand.messages.branch_title : 'N/A'
  }

  getSubmitTime = attention_requested_at => {
    if (attention_requested_at) {
      const dateTime = moment.unix(attention_requested_at).local()

      if (dateTime.calendar().includes('Today')) {
        return dateTime.calendar()
      }

      return dateTime.format('MMM DD, YYYY [at] hh:mm A')
    }

    return ''
  }

  getTdProps = (index, { column }) => {
    if (column.id === 'notification') {
      return {
        style: {
          alignSelf: 'center'
        }
      }
    }

    return {}
  }

  flattenBrand = brand => {
    if (!brand) {
      return null
    }

    const brands = [brand]

    while (brand.parent) {
      brands.push(brand.parent)
      brand = brand.parent
    }

    brands.reverse()

    let merged = {}

    brands.forEach(brand_loop => {
      merge.recursive(merged, { ...brand_loop, parent: undefined })
    })

    return merged
  }

  render() {
    const { isFetchingDeals } = this.props
    const columns = this.Columns
    const data = this.Data

    return (
      <Table
        plugins={{
          sortable: {}
        }}
        getTdProps={this.getTdProps}
        isFetching={isFetchingDeals}
        columns={columns}
        data={data}
        EmptyState={EmptyState}
        LoadingState={LoadingState}
      />
    )
  }
}

function mapStateToProps({ deals }) {
  const { properties, list, roles } = deals

  return {
    isFetchingDeals: properties.isFetchingDeals,
    deals: list,
    roles
  }
}

export default connect(mapStateToProps)(Grid)
