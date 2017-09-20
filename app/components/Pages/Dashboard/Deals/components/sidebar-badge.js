import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import SvgDeals from '../../Partials/Svgs/Deals'

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

        const room = rooms[task.room.id] || task.room
        return room.new_notifications > 0
      })
    })
  }

  getBadgeCount() {
    let counter = 0

    _.each(this.props.deals, deal => {
      if (this.hasNewNotification(deal)) {
        counter += 1
      }
    })

    return counter
  }

  render() {
    const { color } = this.props
    const counter = this.getBadgeCount()

    return (
      <div className="deals-icon">
        <SvgDeals color={color} />
        {counter > 0 && <span className="count">{counter}</span>}
      </div>
    )
  }
}

export default connect(({ deals, chatroom }) => ({
  deals: deals.list,
  tasks: deals.tasks,
  checklists: deals.checklists,
  rooms: chatroom.rooms
}))(BadgeCounter)
