import React from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import cn from 'classnames'
import _ from 'underscore'
import TasksList from './tasks'
import TaskManager from './task-manager'
import ListingCard from './listing-card'
import FactSheet from './factsheet'

class DealDetails extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedTaskId: null
    }
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
        <Col lg={3} md={3} sm={3} className="column left">
          <ListingCard deal={deal} />
          <FactSheet deal={deal} />
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
          className="column deal-task-manager"
          style={{ display: selectedTaskId ? 'inherit' : 'none' }}
        >
          <TaskManager
            taskId={selectedTaskId}
            onCloseTask={() => this.onCloseTask()}
          />
        </Col>
      </Row>
    )
  }
}

function mapStateToProps({ data, deals, chatroom }, props) {
  const { list } = deals
  const { id } = props.params

  return {
    deal: list && list[id] ? list[id] : null
  }
}

export default connect(mapStateToProps)(DealDetails)
