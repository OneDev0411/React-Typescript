import React from 'react'
import { connect } from 'react-redux'

import merge from 'merge'
import moment from 'moment'

import { Container } from './styled'

import Deal from '../../../../../../../models/Deal'

import Table from '../../../../../../../views/components/Grid/Table'
import EmptyState from './empty-state'
import LoadingState from '../../components/loading-state'

import Address from '../../components/table-columns/address'
import Status, { statusSortMethod } from '../../components/table-columns/status'
import CriticalDate, {
  getNextDateValue
} from '../../components/table-columns/critical-date'
import Notifications from '../../components/table-columns/notification-badge'

import getGridTrProps from '../../helpers/get-tr-props'
import getGridTdProps from '../../helpers/get-td-props'

import { getPrimaryAgent } from '../../../utils/roles'

class Grid extends React.Component {
  get Columns() {
    const { roles } = this.props

    return [
      {
        id: 'address',
        header: 'Address',
        width: '21%',
        accessor: deal => Deal.get.address(deal, roles),
        render: ({ rowData: deal }) => <Address deal={deal} roles={roles} />
      },
      {
        id: 'status',
        header: 'Status',
        width: '15%',
        accessor: deal => Deal.get.status(deal),
        sortMethod: statusSortMethod,
        render: ({ rowData: deal }) => <Status deal={deal} />
      },
      {
        id: 'property-type',
        header: 'Property Type',
        accessor: 'property_type'
      },
      {
        id: 'agent-name',
        header: 'Agent Name',
        accessor: deal => getPrimaryAgent(deal, roles)
      },
      {
        id: 'office',
        header: 'Office',
        accessor: deal => this.getOffice(deal)
      },
      {
        id: 'critical-dates',
        header: 'Critical Dates',
        accessor: deal => getNextDateValue(deal),
        render: ({ rowData: deal, totalRows, rowIndex }) => (
          <CriticalDate
            deal={deal}
            rowId={rowIndex + 1}
            rowsCount={totalRows}
          />
        )
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
        width: '40px',
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
    const { deals, activeFilter } = this.props

    if (!deals) {
      return []
    }

    return Object.values(deals).filter(
      deal =>
        deal.attention_requests > 0 &&
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
      <Container>
        <Table
          isFetching={isFetchingDeals}
          columns={columns}
          data={data}
          getTrProps={getGridTrProps}
          getGridTdProps={getGridTdProps}
          EmptyState={EmptyState}
          LoadingState={LoadingState}
        />
      </Container>
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
