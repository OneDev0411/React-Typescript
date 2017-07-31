import React from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import cn from 'classnames'
import TasksList from './tasks'
import TaskManager from './task-manager'
import ListingCard from './listing-card'
import FactSheet from './factsheet'

class DealDetails extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedTask: null
    }
  }

  onSelectTask(task) {
    this.setState({
      selectedTask: task
    })
  }

  onCloseTask() {
    this.setState({ selectedTask: null })
  }

  render() {
    const { deal, tags, params } = this.props
    const { selectedTask } = this.state

    if (!deal) {
      return false
    }

    return (
      <Row className="deal-dashboard">
        <Col lg={3} md={4} sm={4} className="column left">
          <ListingCard deal={deal} />
          <FactSheet deal={deal} />
        </Col>

        <Col
          lg={selectedTask ? 4 : 9}
          md={selectedTask ? 4 : 8}
          sm={selectedTask ? 4 : 8}
          xs={12}
          className="column deal-tasks"
        >
          <TasksList
            dealId={params.id}
            onSelectTask={task => this.onSelectTask(task)}
            selectedTask={selectedTask ? selectedTask.id : null}
            tags={tags}
            tasks={deal.tasks}
          />
        </Col>

        <Col
          lg={5}
          md={4}
          sm={8}
          xs={12}
          className="column deal-task-manager"
          style={{ display: selectedTask ? 'inherit' : 'none' }}
        >
          <TaskManager
            task={selectedTask}
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
    deal: list && list[id] ? list[id] : null,
    tags: data.brand ? data.brand.tags : null
  }
}

export default connect(mapStateToProps)(DealDetails)
