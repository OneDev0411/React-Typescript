import React from 'react'
import BaseTable from './table'
import Deal from '../../../../../models/Deal'

export default class AgentTable extends BaseTable {
  constructor(props) {
    super(props)

    this.cells = {
      address: {
        caption: 'ADDRESS',
        sortable: true,
        className: 'address col-md-3',
        getText: deal => this.getAddress(deal),
        getValue: deal => Deal.get.address(deal)
      },
      status: {
        caption: 'STATUS',
        sortable: true,
        className: 'col-md-2 hidden-xs',
        getText: deal => this.getStatus(deal),
        getValue: deal => Deal.get.field(deal, 'listing_status'),
        sortByList: ['Incoming', 'Coming Soon', 'Active', 'Active Option Contract',
          'Active Contingent', 'Active Kick Out', 'Pending', 'Sold', 'Leased', 'Expired',
          'Temp Off Market', 'Cancelled', 'Withdrawn']
      },
      price: {
        caption: 'PRICE $',
        sortable: true,
        className: 'col-md-1 hidden-xs',
        getText: deal => this.getFormattedNumber(Deal.get.field(deal, 'list_price')),
        getValue: deal => Deal.get.field(deal, 'list_price')
      },
      side: {
        caption: 'SIDE',
        sortable: true,
        className: 'col-md-2 hidden-sm hidden-xs',
        getText: deal => this.getSide(deal),
        getValue: deal => deal.deal_type
      },
      next_date: {
        caption: 'NEXT DATES',
        className: 'col-md-2 hidden-sm hidden-xs',
        getText: deal => this.getNextDate(deal)
      },
      outstanding: {
        caption: 'OUTSTANDING',
        className: 'col-md-1 hidden-sm hidden-xs',
        getText: () => '0'
      },
      notificiation: {
        caption: '',
        className: 'col-md-1 hidden-sm hidden-xs',
        getText: () => ''
      }
    }
  }

  getSide(deal) {
    return (
      <div>
        { deal.deal_type }
        <span style={{ color: '#9b9b9b' }}>
          { this.getRoleNames(deal) }
        </span>
      </div>
    )
  }

  /**
   * get role names of deal for side column
   */
  getRoleNames(deal) {
    const names = []

    deal.roles && deal.roles.forEach(role =>
      names.push(role.user.abbreviated_display_name)
    )

    return ': ' + names.join(', ')
  }

}
