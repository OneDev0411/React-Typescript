import React from 'react'
import { connect } from 'react-redux'
import Header from './header'
import Documents from '../documents'
import UploadFile from '../documents/upload'

import Comments from '../comments'
import CommentInput from '../comments/input'

function scrollEnd() {
  const el = document.getElementById('deals-task-scrollable')
  el.scrollTop = el.scrollHeight
}

const TaskManager = ({
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
            task={task}
          />

          <Comments
            task={task}
          />
        </div>

        <CommentInput
          task={task}
          onCommentSaved={() => scrollEnd()}
          onCloseTask={() => onCloseTask()}
        />
      </UploadFile>
    </div>
  )
}

export default connect(({ deals }) => ({
  tasks: deals.tasks
}))(TaskManager)
