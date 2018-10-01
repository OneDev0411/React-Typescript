import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import _ from 'underscore'

import { deleteNotifications } from 'models/Deal/notification'
import { getDeal } from 'actions/deals'

class DealDetails extends React.Component {
  state = {
    isFetchingDeal: false
  }

  componentDidMount() {
    this.initialize()
    this.handleNotifications(this.props.deal)
  }

  async initialize() {
    const { deal, getDeal, params } = this.props

    if (deal && deal.checklists) {
      return
    }

    if (deal && !deal.checklists) {
      return getDeal(deal.id)
    }

    try {
      this.setState({ isFetchingDeal: true })

      // try to get deal by id
      await getDeal(params.id)

      this.setState({ isFetchingDeal: false })
    } catch (e) {
      browserHistory.push('/dashboard/deals')
    }
  }

  handleNotifications(deal) {
    if (!deal || !Array.isArray(deal.new_notifications)) {
      return false
    }

    const notifications = deal.new_notifications.filter(
      notification => !notification.room
    )

    if (notifications.length > 0) {
      deleteNotifications(_.pluck(notifications, 'id'))
    }
  }

  render() {
    return <div>---</div>
  }
}

function mapStateToProps({ deals, user }, props) {
  const { id } = props.params

  return {
    selectedTask: deals.properties.selectedTask,
    deal: deals.list ? deals.list[id] : null,
    user
  }
}

export default connect(
  mapStateToProps,
  { getDeal }
)(DealDetails)
