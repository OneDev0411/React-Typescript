import React from 'react'
import { connect } from 'react-redux'
import Header from './header'
import Documents from '../documents'
import UploadFile from '../documents/attachments/upload'

import Comments from '../comments'
import CommentInput from '../comments/input'

const TaskManager = ({
  deal,
  task,
  onCloseTask
}) => {
  if (!task) {
    return false
  }

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
            onCloseTask={() => onCloseTask()}
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
          key={`CM_INPUT_${task.id}`}
          task={task}
        />
      </UploadFile>
    </div>
  )
}

function mapStateTopProps({ deals }, { taskId }) {
  return {
    task: taskId ? deals.tasks[taskId] : null
  }
}

export default connect(mapStateTopProps)(TaskManager)
