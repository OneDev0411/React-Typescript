import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import SvgDeals from '../../Partials/Svgs/Deals'

class BadgeCounter extends React.Component {
  constructor(props) {
    super(props)
  }

  getAgentBadge() {
    let counter = 0

    _.each(this.props.deals, deal => {
      if (deal.new_notifications > 0) {
        counter += 1
      }
    })

    return counter
  }

  getBackOfficeBadge() {
    let counter = 0

    _.each(this.props.deals, deal => {
      if (~~deal.attention_requested_count > 0) {
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
    const counter = this.getBadgeCount()

    if (counter > 0) {
      return <span className="c-app-sidenav__notification-badge">{counter}</span>
    }

    return <span />
  }
}

export default connect(({ deals, chatroom }) => ({
  deals: deals.list,
  tasks: deals.tasks,
  checklists: deals.checklists,
  isBackOffice: deals.backoffice,
  rooms: chatroom.rooms
}))(BadgeCounter)
