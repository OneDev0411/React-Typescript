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
        className: 'col-md-2 hidden-xs',
        getText: deal =>
          Deal.get.formattedPrice(Deal.get.field(deal, 'list_price'), 'currency', 0),
        getValue: deal => Deal.get.field(deal, 'list_price')
      },
      side: {
        caption: 'SIDE',
        sortable: true,
        className: 'col-md-2 hidden-sm hidden-xs',
        getText: (deal, rowId, rowsCount) => this.getSide(deal, rowId, rowsCount),
        getValue: deal => deal.deal_type.toString() + this.getRoleNames(deal)
      },
      critical_dates: {
        caption: 'CRITICAL DATES',
        className: 'col-md-2 hidden-sm hidden-xs',
        getText: (deal, rowId, rowsCount) => this.getNextDate(deal, rowId, rowsCount)
      },
      notificiation: {
        caption: '',
        className: 'col-md-1 hidden-sm hidden-xs',
        getText: deal => this.hasNotification(deal)
      },
      searchResult: {
        caption: '',
        justFilter: true,
        getValue: deal => deal.searchResult
      }
    }
  }

  getSide(deal, rowId, rowsCount) {
    const { roles } = this.props

    const sideName = Deal.get.side(deal)
    const relatedRole =
      deal.roles && deal.roles.find(id => roles[id].role === sideName)

    if (!deal.roles || !relatedRole) {
      return Deal.get.side(deal)
    }

    const { user: relatedRoleUser } = relatedRole

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
                        name={`${role.legal_first_name} ${role.legal_last_name}`}
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

                      {role.user && <span className="email">{role.user.email}</span>}
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
              ? `: ${relatedRole.user.last_name}`
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
