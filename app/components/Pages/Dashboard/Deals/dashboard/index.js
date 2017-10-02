import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { Row, Col } from 'react-bootstrap'
import cn from 'classnames'
import _ from 'underscore'
import ReactTooltip from 'react-tooltip'
import Checklists from './checklists'
import TaskDetail from './task-detail'
import EditForm from './edit-form'
import DealInfo from './deal-info'
import ESignAttachments from './esign/attachment'
import ESignCompose from './esign/compose'
import { closeEsign, getEnvelopes } from '../../../../../store_actions/deals'

class DealDetails extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedTaskId: null
    }
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

  componentWillUnmount() {
    this.props.closeEsign()
  }

  onSelectTask(task) {
    this.setState({
      selectedTaskId: task.id
    })
  }

  onCloseTask() {
    this.setState({
      selectedTaskId: null
    })
  }

  render() {
    const { deal, params } = this.props
    const { selectedTaskId } = this.state

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
            selectedTaskId={selectedTaskId}
            onSelectTask={task => this.onSelectTask(task)}
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

        <EditForm
          deal={deal}
        />

        <ESignAttachments
          dealId={deal.id}
        />

        <ESignCompose
          deal={deal}
        />

      </Row>
    )
  }
}

function mapStateToProps({ deals }, props) {
  const { list } = deals
  const { id } = props.params

  return {
    deal: list && list[id] ? list[id] : null
  }
}

export default connect(mapStateToProps, { closeEsign, getEnvelopes })(DealDetails)
