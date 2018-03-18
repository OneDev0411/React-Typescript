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
    const { deal, selectedTask } = this.props
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
        <NavBar deal={deal} />

        <div className="deal-content">
          <div className="column deal-info">
            <DealInfo deal={deal} showBackButton />
          </div>

          <div
            className={`column deal-tasks ${
              selectedTaskId ? 'collapsed' : 'expanded'
            }`}
          >
            <Upload disableClick deal={deal}>
              <Checklists deal={deal} />
            </Upload>
          </div>

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
        </div>

        <ESignAttachments deal={deal} />
        <ESignCompose deal={deal} />
        <UploadPromptModal deal={deal} />
        <PDFSplitterModal deal={deal} />
      </div>
    )
  }
}

function mapStateToProps({ deals }, props) {
  const { id } = props.params

  return {
    selectedTask: deals.selectedTask,
    deal: deals.list ? deals.list[id] : null
  }
}

export default connect(mapStateToProps, { getDeal })(DealDetails)
