import React from 'react'
import { connect } from 'react-redux'
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
  }

  componentDidMount() {
    const { deal, getDeal, params } = this.props

    if (deal && !deal.checklists) {
      getDeal(deal.id)
    } else if (!deal) {
      getDeal(params.id)
    }
  }

  render() {
    const { deal, selectedTask } = this.props
    const selectedTaskId = selectedTask ? selectedTask.id : null

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
