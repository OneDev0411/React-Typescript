import React from 'react'
import { connect } from 'react-redux'
// import { browserHistory } from 'react-router'
import _ from 'underscore'

import { deleteNotifications } from 'models/Deal/notification'

import { getDeal } from 'actions/deals'
import { selectDealById } from 'reducers/deals/list'

import { PageHeader } from './Header'

import TabSections from './Tabs'

import { Container } from './styled'

class DealDetails extends React.Component {
  state = {
    activeTab: 'checklists'
  }

  componentDidMount() {
    this.handleNotifications(this.props.deal)
  }

  handleChangeActiveTab = tab =>
    this.setState({
      activeTab: tab.id
    })

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
    const { deal } = this.props

    if (!deal) {
      return false
    }

    return (
      <Container>
        <PageHeader deal={deal} />

        <TabSections
          deal={deal}
          activeTab={this.state.activeTab}
          onChangeTab={this.handleChangeActiveTab}
        />
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
