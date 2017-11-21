import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { Row, Col } from 'react-bootstrap'
import cn from 'classnames'
import _ from 'underscore'
import ReactTooltip from 'react-tooltip'
import Checklists from './checklists'
import TaskDetail from './task-detail'
import DealInfo from './deal-info'
import ESignAttachments from './esign/attachment'
import ESignCompose from './esign/compose'
import UploadModal from './upload/modal'
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
      <Row className="deal-dashboard">
        <ReactTooltip
          place="top"
          className="deal-filter--tooltip"
          multiline
        />

        <Col
          className="column deal-info"
        >
          <DealInfo
            deal={deal}
            showBackButton={true}
          />
        </Col>

        <Col
          xs={12}
          className={`column deal-tasks ${selectedTaskId ? 'collapsed' : 'expanded'}`}
        >
          <Checklists
            deal={deal}
          />
        </Col>

        <Col
          className="column deal-task-detail"
          style={{ display: selectedTaskId ? 'inherit' : 'none' }}
        >
          <TaskDetail
            deal={deal}
            taskId={selectedTaskId}
            onCloseTask={() => this.onCloseTask()}
          />
        </Col>

        <ESignAttachments
          deal={deal}
        />

        <ESignCompose
          deal={deal}
        />

        <UploadModal />
      </Row>
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
