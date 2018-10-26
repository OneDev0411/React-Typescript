import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'

import { deleteNotifications } from 'models/Deal/notification'

import { isBackOffice } from 'utils/user-teams'
import { getDeal } from 'actions/deals'
import { selectDealById } from 'reducers/deals/list'
import { selectTaskById } from 'reducers/deals/tasks'

import { PageHeader } from './Header'
import TabSections from './Tabs'
import TaskView from './TaskView'

import UploadPrompt from '../UploadManager/prompt'

import { DealContainer, PageWrapper } from './styled'

class DealDetails extends React.Component {
  state = {
    activeTab: 'checklists',
    isFetchingChecklists: false
  }

  componentDidMount() {
    this.handleNotifications(this.props.deal)

    this.initializeDeal()
  }

  initializeDeal = async () => {
    const { deal } = this.props

    if (deal && deal.checklists) {
      return false
    }

    try {
      if (!deal || !deal.checklist) {
        this.setState({ isFetchingChecklists: true })

        // fetch deal by id
        await this.props.getDeal(deal.id)

        this.setState({ isFetchingChecklists: false })
      }
    } catch (e) {
      console.log(e)
      console.error('Could not fetch deal')
    }
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
      <DealContainer disableScroll={this.props.selectedTask !== null}>
        <PageWrapper>
          <PageHeader deal={deal} isBackOffice={this.props.isBackOffice} />

          <TabSections
            deal={deal}
            user={this.props.user}
            activeTab={this.state.activeTab}
            onChangeTab={this.handleChangeActiveTab}
            isBackOffice={this.props.isBackOffice}
            isFetchingChecklists={this.state.isFetchingChecklists}
          />

          <TaskView
            deal={deal}
            task={this.props.selectedTask}
            isOpen={this.props.selectedTask !== null}
            isBackOffice={this.props.isBackOffice}
          />
        </PageWrapper>

        <UploadPrompt deal={deal} />
      </DealContainer>
    )
  }
}

function mapStateToProps({ deals, user }, { params }) {
  const { selectedTask } = deals.properties

  return {
    user,
    selectedTask: selectTaskById(deals.tasks, selectedTask && selectedTask.id),
    deal: selectDealById(deals.list, params.id),
    isBackOffice: isBackOffice(user)
  }
}

export default connect(
  mapStateToProps,
  { getDeal }
)(DealDetails)
