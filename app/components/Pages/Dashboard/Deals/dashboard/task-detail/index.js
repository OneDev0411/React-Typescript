import React from 'react'
import { connect } from 'react-redux'
import Header from './header'
import Documents from '../documents'
import Upload from '../upload'

import Comments from '../comments'
import CommentInput from '../comments/input'

const TaskManager = ({ deal, task }) => {
  const isWebkit = 'WebkitAppearance' in document.documentElement.style

  if (!task) {
    return false
  }

  return (
    <div className="full-width" data-simplebar={!isWebkit || null}>
      <Upload disableClick deal={deal}>
        <div className="scrollable" id="deals-task-scrollable">
          <Header deal={deal} key={task.id} task={task} />

          <Documents deal={deal} task={task} />

          <Comments deal={deal} task={task} />
        </div>

        <CommentInput key={task.id} task={task} />
      </Upload>
    </div>
  )
}

function mapStateTopProps({ deals }, { taskId }) {
  return {
    task: taskId ? deals.tasks[taskId] : null
  }
}

export default connect(mapStateTopProps)(TaskManager)
