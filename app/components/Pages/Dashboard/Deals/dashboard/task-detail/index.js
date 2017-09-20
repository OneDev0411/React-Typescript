import React from 'react'
import { connect } from 'react-redux'
import Header from './header'
import Documents from '../documents'
import UploadFile from '../documents/attachments/upload'

import Comments from '../comments'
import CommentInput from '../comments/input'

const TaskManager = ({
  deal,
  tasks,
  taskId,
  onCloseTask
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
        <div
          className="scrollable"
          id="deals-task-scrollable"
        >
          <Header
            task={task}
          />

          <Documents
            deal={deal}
            task={task}
          />

          <Comments
            task={task}
          />
        </div>

        <CommentInput
          task={task}
          onCloseTask={() => onCloseTask()}
        />
      </UploadFile>
    </div>
  )
}

export default connect(({ deals }) => ({
  tasks: deals.tasks
}))(TaskManager)
