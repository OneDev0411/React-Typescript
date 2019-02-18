import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'

import { deleteNotifications } from 'models/Deal/notification'

import { isBackOffice } from 'utils/user-teams'
import { getDeal, getContexts } from 'actions/deals'
import { selectDealById } from 'reducers/deals/list'
import { selectTaskById } from 'reducers/deals/tasks'

import { PageHeader } from './Header'
import TabSections from './Tabs'
import TaskView from './TaskView'

import UploadPrompt from '../UploadManager/prompt'

import { DealContainer, PageWrapper } from './styled'

class DealDetails extends React.Component {
  state = {
    activeTab: this.props.params.tab || 'checklists',
    isFetchingDeal: false,
    isFetchingContexts: false
  }

  componentDidMount() {
    this.handleNotifications(this.props.deal)

    this.initializeDeal()
  }

  initializeDeal = async () => {
    const { props } = this

    if (props.deal && props.deal.checklists) {
      this.fetchContexts(props.deal)

      return false
    }

    try {
      const deal = await this.getDeal()

      this.fetchContexts(deal)
    } catch (e) {
      console.log(e)
      console.error('Could not fetch deal or contexts')
    }
  }

  getDeal = async () => {
    if (this.props.deal && this.props.deal.checklist) {
      return false
    }

    this.setState({ isFetchingDeal: true })

    // fetch deal by id
    const deal = await this.props.getDeal(this.props.params.id)

    this.setState({ isFetchingDeal: false })

    return deal
  }

  fetchContexts = async deal => {
    const brandId = deal.brand.id

    if (this.props.contexts[brandId]) {
      return false
    }

    this.setState({ isFetchingContexts: true })

    console.log(`[ + ] fetching ${brandId} contexts`)
    await this.props.getContexts(brandId)

    this.setState({ isFetchingContexts: false })
  }

  handleChangeActiveTab = tab => {
    this.setState({
      activeTab: tab.id
    })
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
    const { props, state } = this

    if (!props.deal) {
      return false
    }

    return (
      <DealContainer>
        <PageWrapper>
          <PageHeader deal={props.deal} isBackOffice={props.isBackOffice} />

          <TabSections
            deal={props.deal}
            user={props.user}
            activeTab={state.activeTab}
            onChangeTab={this.handleChangeActiveTab}
            isBackOffice={props.isBackOffice}
            isFetchingChecklists={state.isFetchingDeal}
            isFetchingContexts={state.isFetchingContexts}
          />

          <TaskView
            deal={props.deal}
            task={props.selectedTask}
            isOpen={props.selectedTask !== null}
            isBackOffice={props.isBackOffice}
          />
        </PageWrapper>

        <UploadPrompt deal={props.deal} />
      </DealContainer>
    )
  }
}

function mapStateToProps({ deals, user }, { params }) {
  const { selectedTask } = deals.properties

  return {
    user,
    contexts: deals.contexts,
    deal: selectDealById(deals.list, params.id),
    selectedTask: selectTaskById(deals.tasks, selectedTask && selectedTask.id),
    isBackOffice: isBackOffice(user)
  }
}

export default connect(
  mapStateToProps,
  { getDeal, getContexts }
)(DealDetails)
