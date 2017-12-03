import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import SvgDeals from '../../Partials/Svgs/Deals'
import getNeedsAttentions from '../utils/needs-attention'

class BadgeCounter extends React.Component {
  constructor(props) {
    super(props)
  }

  hasNewNotification(deal) {
    const { checklists, tasks, rooms } = this.props

    if (!deal.checklists) {
      return false
    }

    return deal.checklists.some(chId => {
      const checklist = checklists && checklists[chId]

      if (!checklist || !checklist.tasks) {
        return false
      }

      return checklist.tasks.some(tId => {
        const task = tasks && tasks[tId]

        if (!task) {
          return false
        }

        const room = (rooms && rooms[task.room.id]) || task.room

        return room.new_notifications > 0
      })
    })
  }

  getAgentBadge() {
    let counter = 0

    _.each(this.props.deals, deal => {
      if (this.hasNewNotification(deal)) {
        counter += 1
      }
    })

    return counter
  }

  getBackOfficeBadge() {
    let counter = 0

    _.each(this.props.deals, deal => {
      if (getNeedsAttentions(deal).length > 0) {
        counter += 1
      }
    })

    return counter
  }

  getBadgeCount() {
    const { isBackOffice } = this.props

    return isBackOffice ? this.getBackOfficeBadge() : this.getAgentBadge()
  }

  render() {
    const { color } = this.props
    const counter = this.getBadgeCount()

    return (
      <span className="c-app-navbar__item__inbox__icon">
        <SvgDeals color={color} />
        {counter > 0 && (
          <span className="c-app-navbar__notification-badge">{counter}</span>
        )}
      </span>
    )
  }
}

export default connect(({ deals, chatroom }) => ({
  deals: deals.list,
  tasks: deals.tasks,
  checklists: deals.checklists,
  isBackOffice: deals.backoffice,
  rooms: chatroom.rooms
}))(BadgeCounter)
