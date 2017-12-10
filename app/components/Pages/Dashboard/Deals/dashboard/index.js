import React from 'react'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'
import { Row, Col, Button } from 'react-bootstrap'
import cn from 'classnames'
import _ from 'underscore'
import Checklists from './checklists'
import TaskDetail from './task-detail'
import DealInfo from './deal-info'
import ESignAttachments from './esign/attachment'
import ESignCompose from './esign/compose'
import UploadPromptModal from './upload/prompt'
import PDFSplitterModal from './upload/pdf-splitter'
import NavBar from './navbar'
import { getEnvelopes } from '../../../../../store_actions/deals'

class DealDetails extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { deal, getEnvelopes } = this.props

    if (deal === null) {
      return browserHistory.push('/dashboard/deals')
    }

    if (!deal.envelopes) {
      getEnvelopes(deal.id)
    }
  }

  render() {
    const { deal, selectedTask, params } = this.props
    const selectedTaskId = selectedTask ? selectedTask.id : null

    if (!deal) {
      return false
    }

    return (
      <div className="deal-dashboard">

        <NavBar deal={deal} />

        <div className="deal-content">
          <div className="column deal-info">
            <DealInfo
              deal={deal}
              showBackButton={true}
            />
          </div>

          <div className={`column deal-tasks ${selectedTaskId ? 'collapsed' : 'expanded'}`}>
            <div className="create-offer">
              <Button
                className="add-offer-button"
                onClick={() => browserHistory.push(`/dashboard/deals/${deal.id}/create-offer`)}
              >
                Add New Offer
              </Button>
            </div>

            <Checklists
              deal={deal}
            />
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
        <UploadPromptModal />
        <PDFSplitterModal />
      </div>
    )
  }
}

function mapStateToProps({ deals }, props) {
  const { list } = deals
  const { id } = props.params

  return {
    selectedTask: deals.selectedTask,
    deal: list && list[id] ? list[id] : null
  }
}

export default connect(mapStateToProps, { getEnvelopes })(DealDetails)
