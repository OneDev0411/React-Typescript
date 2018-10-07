import React from 'react'
import { connect } from 'react-redux'
// import { browserHistory } from 'react-router'
import _ from 'underscore'

import { deleteNotifications } from 'models/Deal/notification'

import { isBackOffice } from 'utils/user-teams'
import { getDeal } from 'actions/deals'
import { selectDealById } from 'reducers/deals/list'
import { selectTaskById } from 'reducers/deals/tasks'

import { PageHeader } from './Header'
import TabSections from './Tabs'
import TaskView from './TaskView'

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
      <Container disableScroll={this.props.selectedTask !== null}>
        <PageHeader deal={deal} />

        <TabSections
          deal={deal}
          activeTab={this.state.activeTab}
          onChangeTab={this.handleChangeActiveTab}
          isBackOffice={this.props.isBackOffice}
        />

        <TaskView
          deal={deal}
          task={this.props.selectedTask}
          isOpen={this.props.selectedTask !== null}
          isBackOffice={this.props.isBackOffice}
        />
      </Container>
    )
  }
}

function mapStateToProps({ deals, user }, { params }) {
  const { selectedTask } = deals.properties

  return {
    selectedTask: selectTaskById(deals.tasks, selectedTask && selectedTask.id),
    deal: selectDealById(deals.list, params.id),
    isBackOffice: isBackOffice(user)
  }
}

export default connect(
  mapStateToProps,
  { getDeal }
)(DealDetails)
