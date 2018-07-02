import React, { Fragment, Component } from 'react'
import { connect } from 'react-redux'

import { getTasks } from '../../../../store_actions/tasks'
import { selectTasks, isFetchingTasks } from '../../../../reducers/tasks/list'

import Table from './Table'
import Header from './Header'

import NewTask from '../components/NewTask'
import OverlayDrawer from '../../../components/OverlayDrawer'

class TasksList extends Component {
  state = {
    isOpen: false,
    selectedTaskId: null
  }

  componentDidMount() {
    this.initialTasks()
  }

  async initialTasks() {
    const { isFetching, getTasks } = this.props

    if (!isFetching) {
      const query = [
        'order=-updated_at',
        'associations[]=crm_task.reminders',
        'associations[]=crm_task.associations'
      ].join('&')

      await getTasks(query)
    }
  }

  onOpen = () => this.setState({ isOpen: true })
  onClose = () => {
    console.log('close', this.state)
    this.setState({ isOpen: false, selectedTaskId: null })
  }

  handleSelectTask = taskId =>
    this.setState({
      isOpen: true,
      selectedTaskId: taskId
    })

  render() {
    const { isOpen, selectedTaskId } = this.state
    const { isFetching, tasks } = this.props

    return (
      <Fragment>
        <Header onCreateTask={this.onOpen} />

        <OverlayDrawer
          isOpen={isOpen}
          width={50}
          showFooter={false}
          onClose={this.onClose}
        >
          <OverlayDrawer.Header
            title={selectedTaskId ? 'Edit Task' : 'Add Task'}
          />
          <OverlayDrawer.Body>
            {isOpen && (
              <NewTask
                className="overlay-drawer"
                taskId={selectedTaskId}
                submitCallback={this.onClose}
                deleteCallback={this.onClose}
              />
            )}
          </OverlayDrawer.Body>
        </OverlayDrawer>

        <Table
          tasks={tasks}
          isFetching={isFetching}
          onSelectTask={this.handleSelectTask}
        />
      </Fragment>
    )
  }
}

function mapStateToProps(state) {
  const {
    tasks: { list }
  } = state

  return {
    tasks: selectTasks(list),
    isFetching: isFetchingTasks(list)
  }
}

export default connect(
  mapStateToProps,
  { getTasks }
)(TasksList)
