import React from 'react'
import { connect } from 'react-redux'
import Header from './header'
import Comments from './comments'
import Documents from './documents'
import UploadFile from './documents/upload'

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
      <UploadFile
        disableClick={true}
        task={task}
      >
        <Header
          task={task}
        />

        <Documents
          task={task}
        />

      </UploadFile>
    </div>
  )
}

export default connect(({ deals }) => ({
  tasks: deals.tasks
}))(TaskManager)
