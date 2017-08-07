import React from 'react'
import { connect } from 'react-redux'
import Header from './header'
import Comments from './comments'
import Documents from './documents'

const TaskManager = ({
  tasks,
  taskId
}) => {
  if (!taskId) {
    return false
  }

  const task = tasks[taskId]

  return (
    <div className="full-width">

      <Header
        task={task}
      />

      <Documents
        task={task}
      />

      <Comments
        task={task}
      />
    </div>
  )
}

export default connect(({ deals }) => ({
  tasks: deals.tasks
}))(TaskManager)
