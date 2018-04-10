import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import Checklists from './checklists'
import TaskDetail from './task-detail'
import UploadPromptModal from './upload/prompt'
import PDFSplitterModal from '../pdf-splitter'
import DealInfo from './deal-info'
import ESignAttachments from './esign/attachment'
import ESignCompose from './esign/compose'
import Upload from './upload'
import NavBar from './navbar'
import { getDeal } from '../../../../../store_actions/deals'
import { isTrainingAccount } from '../../../../../utils/user-teams'
import styled from 'styled-components'

const DealContent = styled.div`
  display: flex;
  flex-direction: row;
  overflow: hidden;
  backface-visibility: hidden;
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: none;
  will-change: overflow;
  position: relative;
  min-height: calc(
    100vh - 54px - 2px ${props => (props.traningAccount ? ' - 48px' : '')}
  );
  max-height: calc(
    100vh - 54px - 2px ${props => (props.traningAccount ? ' - 48px' : '')}
  );
  .column {
    padding: 0;
    height: auto;
  }
`

const DealTasks = styled.div`
  min-height: calc(
    100vh - 54px - 2px ${props => (props.traningAccount ? ' - 48px' : '')}
  );
  max-height: calc(
    100vh - 54px - 2px ${props => (props.traningAccount ? ' - 48px' : '')}
  );
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

    const traningAccount = isTrainingAccount(user)

    return (
      <div className="deal-dashboard u-scrollbar--thinner">
        <NavBar deal={deal} />

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
    selectedTask: deals.selectedTask,
    deal: deals.list ? deals.list[id] : null,
    user
  }
}

export default connect(mapStateToProps, { getDeal })(DealDetails)
