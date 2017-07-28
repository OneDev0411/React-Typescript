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
    const { deal, tags } = this.props
    const { selectedTask } = this.state

    return (
      <Row className="deal-dashboard">
        <Col lg={3} md={4} className="column left">
          <ListingCard deal={deal} />
          <FactSheet deal={deal} />
        </Col>

        <Col lg={9} md={8} className="column middle">

          <div className="deal-tasks-container">

            <div className={cn('deal-tasks', { half: selectedTask !== null })}>
              <TasksList
                onSelectTask={task => this.onSelectTask(task)}
                selectedTask={selectedTask ? selectedTask.id : null}
                tags={tags}
                tasks={deal.tasks}
              />
            </div>

            <div
              className={cn('deal-task-manager', { visible: selectedTask !== null })}
            >
              <TaskManager
                task={selectedTask}
                onCloseTask={() => this.onCloseTask()}
              />
            </div>

          </div>
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
