import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import { goBackFromEditTask } from '../helpers/go-back-from-edit'
import { selectTask } from '../../../../reducers/tasks/list'

import Header from './Header'
import Task from '../components/NewTask'

function TaskPage(props) {
  const { task, id } = props

  const title = id && id !== 'new' ? 'Edit' : 'New'

  return (
    <div
      className="c-new-task--page"
      style={{
        minHeight: '100vh',
        background: '#f0f4f7'
      }}
    >
      <Header title={`${title} Task`} />
      <Task
        task={task}
        taskId={id}
        submitCallback={goBackFromEditTask}
        deleteCallback={goBackFromEditTask}
      />
    </div>
  )
}

function mapStateToProps({ tasks }, props) {
  let task = null
  const {
    location: { state: routerState },
    params: { id }
  } = props

  if (routerState && routerState.task) {
    task = routerState.task

    return { task, id }
  }

  const { list } = tasks

  task = selectTask(list, id)

  return { task, id }
}

export default withRouter(connect(mapStateToProps)(TaskPage))
