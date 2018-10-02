import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import _ from 'underscore'

import { deleteNotifications } from 'models/Deal/notification'

import { getDeal } from 'actions/deals'
import { selectDealById } from 'reducers/deals/list'

import { PageHeader } from './Header'

import { Container } from './styled'

class DealDetails extends React.Component {
  componentDidMount() {
    this.handleNotifications(this.props.deal)
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
    return (
      <Container>
        <PageHeader deal={this.props.deal} />
      </Container>
    )
  }
}

function mapStateToProps({ deals }, props) {
  return {
    selectedTask: deals.properties.selectedTask,
    deal: selectDealById(deals.list, props.params.id)
  }
}

export default connect(
  mapStateToProps,
  { getDeal }
)(DealDetails)
