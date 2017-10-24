import React from 'react'
import { connect } from 'react-redux'
import { Popover, OverlayTrigger } from 'react-bootstrap'
import BaseTable from './table'
import Deal from '../../../../../models/Deal'
import UserAvatar from '../../../../Partials/UserAvatar'
import roleName from '../utils/roles'

class AgentTable extends BaseTable {
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
        getText: (deal, rowId) => this.getSide(deal, rowId),
        getValue: deal => deal.deal_type.toString() + this.getRoleNames(deal)
      },
      critical_dates: {
        caption: 'CRITICAL DATES',
        className: 'col-md-2 hidden-sm hidden-xs',
        getText: (deal, rowId) => this.getNextDate(deal, rowId)
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

  getSide(deal, rowId) {
    const { deals } = this.props
    const dealsCount = _.size(deals)

    if (!deal.roles) {
      return Deal.get.side(deal)
    }

    const firstRole = deal.roles && deal.roles[0]

    return (
      <OverlayTrigger
        trigger={['hover', 'focus']}
        placement={rowId > 3 && rowId + 3 >= dealsCount ? 'top' : 'bottom'}
        overlay={
          <Popover
            className="deal-list--popover push-left"
            id={`popover-trigger-sides-${deal.id}`}
          >
            <div className="roles">
              {
                deal.roles.map(role =>
                  <div
                    key={`ROLE_${role.id}`}
                    className="item"
                  >
                    <div className="avatar">
                      <UserAvatar
                        name={role.user.display_name}
                        image={role.user.profile_image_url}
                        size={26}
                        showStateIndicator={false}
                      />
                    </div>
                    <div className="info">
                      <span className="name">{ role.user.abbreviated_display_name }, </span>
                      <span className="role">{ roleName(role.role) }</span>
                      <span className="email">{ role.user.email }</span>
                    </div>
                  </div>
                )
              }
            </div>
          </Popover>
        }
      >
        <div className="hoverable inline">
          <span>
            { Deal.get.side(deal) }
          </span>

          <span
            style={{ color: '#5b6469', fontSize: '13px' }}
          >
            { firstRole ? `: ${firstRole.user.abbreviated_display_name}` : ''}
          </span>

          <i className="fa fa-caret-down" />
        </div>

      </OverlayTrigger>
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
