import React from 'react'
import { connect } from 'react-redux'
import { Popover, OverlayTrigger } from 'react-bootstrap'
import BaseTable from './table'
import Deal from '../../../../../models/Deal'
import UserAvatar from '../../../../Partials/UserAvatar'
import { roleName } from '../utils/roles'
import {
  closeEsignWizard,
  setSelectedTask
} from '../../../../../store_actions/deals'
import { getPrimaryAgent } from '../utils/roles'

class AgentTable extends BaseTable {
  constructor(props) {
    super(props)

    this.cells = {
      address: {
        caption: 'ADDRESS',
        sortable: true,
        className: 'address col-md-4',
        getText: deal => this.getAddress(deal),
        getValue: deal => Deal.get.address(deal)
      },
      status: {
        caption: 'STATUS',
        sortable: true,
        className: 'col-md-2 hidden-xs',
        getText: deal => this.getStatus(deal),
        getValue: deal => Deal.get.status(deal),

        sortByList: [
          'Incoming',
          'Coming Soon',
          'Active',
          'Active Option Contract',
          'Active Contingent',
          'Active Kick Out',
          'Pending',
          'Sold',
          'Leased',
          'Expired',
          'Temp Off Market',
          'Cancelled',
          'Withdrawn'
        ]
      },
      price: {
        caption: 'PRICE $',
        sortable: true,
        className: 'col-md-1 hidden-xs',
        getText: deal =>
          Deal.get.formattedPrice(this.getPriceValue(deal), 'currency', 0),
        getValue: deal => this.getPriceValue(deal)
      },
      side: {
        caption: 'SIDE',
        sortable: true,
        className: 'col-md-1 hidden-sm hidden-xs',
        getText: (deal, rowId, rowsCount) =>
          this.getSide(deal, rowId, rowsCount),
        getValue: deal => deal.deal_type.toString() + this.getRoleNames(deal)
      },
      critical_dates: {
        caption: 'CRITICAL DATES',
        className: 'col-md-2 hidden-sm hidden-xs',
        getText: (deal, rowId, rowsCount) =>
          this.getNextDate(deal, rowId, rowsCount)
      },
      agent_name: {
        caption: 'AGENT NAME',
        sortable: true,
        className: 'col-md-2 hidden-sm hidden-xs',
        getText: deal => getPrimaryAgent(deal, this.props.roles),
        getValue: deal => getPrimaryAgent(deal, this.props.roles)
      },
      notificiation: {
        caption: '',
        className: 'notification-container hidden-sm hidden-xs',
        getText: deal => this.hasNotification(deal)
      },
      searchResult: {
        caption: '',
        justFilter: true,
        getValue: deal => deal.searchResult
      }
    }
  }

  getPriceValue(deal) {
    return (
      Deal.get.field(deal, 'sales_price') || Deal.get.field(deal, 'list_price')
    )
  }

  getSide(deal, rowId, rowsCount) {
    const { roles } = this.props

    const sideName = Deal.get.side(deal)
    const relatedRole =
      deal.roles && deal.roles.find(id => roles[id].role === sideName)

    if (!deal.roles) {
      return Deal.get.side(deal)
    }

    let relatedRoleUser

    if (roles && roles[relatedRole]) {
      relatedRoleUser = roles[relatedRole].user
    }

    return (
      <OverlayTrigger
        trigger={['hover', 'focus']}
        placement={rowId > 3 && rowId + 3 >= rowsCount ? 'top' : 'bottom'}
        overlay={
          <Popover
            className="deal-list--popover push-left"
            id={`popover-trigger-sides-${deal.id}`}
          >
            <div className="roles">
              {deal.roles.map(id => {
                const role = roles[id]

                return (
                  <div key={`ROLE_${role.id}`} className="item">
                    <div className="avatar">
                      <UserAvatar
                        name={`${role.legal_first_name} ${
                          role.legal_last_name
                        }`}
                        image={role.user ? role.user.profile_image_url : null}
                        size={26}
                        showStateIndicator={false}
                      />
                    </div>
                    <div className="info">
                      <span className="name">
                        {`${role.legal_first_name} ${role.legal_last_name}`},
                      </span>

                      <span className="role">{roleName(role.role)}</span>

                      {role.user && (
                        <span className="email">{role.user.email}</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </Popover>
        }
      >
        <div className="hoverable inline">
          <span>{sideName}</span>

          <span
            style={{
              color: '#5b6469',
              fontSize: '13px'
            }}
          >
            {relatedRoleUser && relatedRoleUser.last_name
              ? `: ${relatedRoleUser.last_name}`
              : ''}
          </span>
        </div>
      </OverlayTrigger>
    )
  }

  /**
   * get role names of deal for side column
   */
  getRoleNames(deal) {
    const { roles } = this.props
    const names = []

    deal.roles &&
      deal.roles.forEach(id => {
        const role = roles[id]

        names.push(`${role.legal_first_name} ${role.legal_last_name}`)
      })

    return `: ${names.join(', ')}`
  }
}

export default connect(
  ({ deals, chatroom }) => ({
    tasks: deals.tasks,
    checklists: deals.checklists,
    roles: deals.roles,
    rooms: chatroom.rooms
  }),
  {
    closeEsignWizard,
    setSelectedTask
  }
)(AgentTable)
