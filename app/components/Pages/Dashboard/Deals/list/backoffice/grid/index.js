import React from 'react'
import { connect } from 'react-redux'
import merge from 'merge'
import moment from 'moment'

import { Container } from './styled'

import Table from '../../../../../../../views/components/Grid/Table'
import EmptyState from './empty-state'
import LoadingState from '../../components/loading-state'

import Address from '../../components/table-columns/address'
import Status from '../../components/table-columns/status'
import CriticalDate from '../../components/table-columns/critical-date'
import Notifications from '../../components/table-columns/notification-badge'

import { getPrimaryAgent } from '../../../utils/roles'

class Grid extends React.Component {
  get Columns() {
    const { roles } = this.props

    return [
      {
        id: 'addres',
        header: 'ADDRESS',
        width: '24%',
        render: ({ rowData: deal }) => <Address deal={deal} roles={roles} />
      },
      {
        id: 'status',
        header: 'STATUS',
        width: '15%',
        render: ({ rowData: deal }) => <Status deal={deal} />
      },
      {
        id: 'property-type',
        header: 'PROPERTY TYPE',
        render: ({ rowData: deal }) => deal.property_type
      },
      {
        id: 'agent-name',
        header: 'AGENT NAME',
        render: ({ rowData: deal }) => getPrimaryAgent(deal, roles)
      },
      {
        id: 'office',
        header: 'OFFICE',
        render: ({ rowData: deal }) => this.getOffice(deal)
      },
      {
        id: 'critical-dates',
        header: 'CRITICAL DATES',
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
        header: 'SUBMITTED AT',
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
    const { deals } = this.props

    if (!deals) {
      return []
    }

    return Object.values(deals)
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
          getTrProps={this.getGridTrProps}
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
