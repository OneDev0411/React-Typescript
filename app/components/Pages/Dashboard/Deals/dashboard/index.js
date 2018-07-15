import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import _ from 'underscore'

import { deleteNotifications } from '../../../../../models/Deal/notification'

import Checklists from './checklists'
import TaskDetail from './task-detail'
import UploadPromptModal from './upload/prompt'
import PDFSplitterModal from '../pdf-splitter'
import DealInfo from './deal-info'
import ESignAttachments from './esign/attachment'
import ESignCompose from './esign/compose'
import Upload from './upload'
import PageHeader from './page-header'
import TemplatePicker from './template/picker'
import { getDeal } from '../../../../../store_actions/deals'
import { isTrainingAccount } from '../../../../../utils/user-teams'

import { DealContent, DealTasks } from './styled'

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
    if (!deal || !deal.new_notifications) {
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
    const { isFetchingDeal } = this.state
    const { deal, selectedTask, user } = this.props

    const traningAccount = isTrainingAccount(user)
    const selectedTaskId = selectedTask ? selectedTask.id : null

    if (!deal && isFetchingDeal) {
      return (
        <div className="deal-dashboard loading-deal">
          <i className="fa fa-spin fa-spinner fa-2x" /> Loading Deal ...
        </div>
      )
    }

    if (!deal) {
      return false
    }

    return (
      <div className="deal-dashboard u-scrollbar--thinner">
        <PageHeader deal={deal} />

        <DealContent traningAccount={traningAccount}>
          <div className="column deal-info">
            <DealInfo
              deal={deal}
              showBackButton
              traningAccount={traningAccount}
            />
          </div>

          <DealTasks
            className={`column deal-tasks ${
              selectedTaskId ? 'collapsed' : 'expanded'
            }`}
            traningAccount={traningAccount}
          >
            <Upload disableClick deal={deal}>
              <Checklists deal={deal} />
            </Upload>
          </DealTasks>

          <div
            className="column deal-task-detail"
            style={{ display: selectedTaskId ? 'inherit' : 'none' }}
          >
            <TaskDetail
              deal={deal}
              taskId={selectedTaskId}
              onCloseTask={() => this.onCloseTask()}
            />
          </div>
        </DealContent>

        <ESignAttachments deal={deal} />
        <ESignCompose deal={deal} />
        <UploadPromptModal deal={deal} />
        <PDFSplitterModal deal={deal} />
        <TemplatePicker deal={ deal } />
      </div>
    )
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
