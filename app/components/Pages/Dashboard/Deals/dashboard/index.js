import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { browserHistory } from 'react-router'

import Checklists from './checklists'
import TaskDetail from './task-detail'
import UploadPromptModal from './upload/prompt'
import PDFSplitterModal from '../pdf-splitter'
import DealInfo from './deal-info'
import ESignAttachments from './esign/attachment'
import ESignCompose from './esign/compose'
import Upload from './upload'
import PageHeader from './page-header'
import { getDeal } from '../../../../../store_actions/deals'
import { isTrainingAccount } from '../../../../../utils/user-teams'
import { getDashboardHeight } from '../utils/get-dashboard-height'

const DealTasks = styled.div`
  min-height: ${({ traningAccount }) => getDashboardHeight(traningAccount)};
  max-height: ${({ traningAccount }) => getDashboardHeight(traningAccount)};
`

const DealContent = DealTasks.extend`
  position: relative;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  will-change: overflow;
  backface-visibility: hidden;

  .column {
    padding: 0;
    height: auto;
  }
`

class DealDetails extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isFetchingDeal: false
    }
  }

  componentDidMount() {
    this.initialize()
  }

  async initialize() {
    const { deal, getDeal, params } = this.props

    if (deal && !deal.checklists) {
      return getDeal(deal.id)
    }

    try {
      if (!deal) {
        this.setState({ isFetchingDeal: true })

        // try to get deal by id
        await getDeal(params.id)

        this.setState({ isFetchingDeal: false })
      }
    } catch (e) {
      browserHistory.push('/dashboard/deals')
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

export default connect(mapStateToProps, { getDeal })(DealDetails)
