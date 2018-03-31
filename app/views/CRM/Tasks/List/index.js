import React, { Fragment, Component } from 'react'
import { connect } from 'react-redux'

import { getTasks } from '../../../../store_actions/tasks'
import { selectTasks, isFetchingTasks } from '../../../../reducers/tasks/list'

import Table from './Table'
import Header from './Header'

class TasksList extends Component {
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

  render() {
    const { isFetching, tasks } = this.props

    return (
      <Fragment>
        <Header />
        <Table tasks={tasks} isFetching={isFetching} />
      </Fragment>
    )
  }
}

function mapStateToProps(state) {
  const { tasks: { list } } = state

  return {
    tasks: selectTasks(list),
    isFetching: isFetchingTasks(list)
  }
}

export default connect(mapStateToProps, { getTasks })(TasksList)
