import React from 'react'
import { connect } from 'react-redux'
import BaseTable from './table'
import Deal from '../../../../../models/Deal'

class AgentTable extends BaseTable {
  constructor(props) {
    super(props)

    this.cells = {
      address: {
        caption: 'ADDRESS',
        sortable: true,
        className: 'address col-md-3',
        getText: deal => this.getAddress(deal),
        getValue: deal => Deal.get.field(deal, 'full_address')
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
        getValue: deal => deal.deal_type.toString() + this.getRoleNames(deal)
      },
      critical_dates: {
        caption: 'CRITICAL DATES',
        className: 'col-md-2 hidden-sm hidden-xs',
        getText: deal => this.getNextDate(deal)
      },
      outstanding: {
        caption: 'OUTSTANDING',
        className: 'col-md-1 hidden-sm hidden-xs',
        sortable: true,
        getText: deal => this.getOutstandingsCount(deal)
      },
      notificiation: {
        caption: '',
        className: 'col-md-1 hidden-sm hidden-xs',
        getText: deal => this.hasNotification(deal)
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

  /**
   * get outstandings count
   */
  getOutstandingsCount(deal) {
    let counter = 0

    if (!deal.checklists) {
      return counter
    }

    deal.checklists.forEach(id => {
      const checklist = this.props.checklists[id]
      if (!checklist.tasks || checklist.tasks.length === 0) {
        return
      }

      checklist.tasks.forEach(task_id => {
        const task = this.props.tasks[task_id]
        if (!task.review || task.review.status === 'Declined') {
          counter += 1
        }
      })
    })

    return counter
  }
}

export default connect(({ deals, chatroom }) => ({
  tasks: deals.tasks,
  checklists: deals.checklists,
  rooms: chatroom.rooms
}))(AgentTable)
