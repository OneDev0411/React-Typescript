import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { Row, Col } from 'react-bootstrap'
import cn from 'classnames'
import _ from 'underscore'
import TasksList from './tasks'
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
      browserHistory.push('/dashboard/deals')
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
        <Col lg={3} md={3} sm={3} className="column info-column">
          <DealInfo
            deal={deal}
            showBackButton={true}
          />
        </Col>

        <Col
          lg={selectedTaskId ? 4 : 9}
          md={selectedTaskId ? 4 : 9}
          sm={selectedTaskId ? 4 : 9}
          xs={12}
          className="column deal-tasks"
        >
          <TasksList
            deal={deal}
            selectedTaskId={selectedTaskId}
            onSelectTask={task => this.onSelectTask(task)}
          />
        </Col>

        <Col
          lg={5}
          md={5}
          sm={5}
          xs={12}
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
