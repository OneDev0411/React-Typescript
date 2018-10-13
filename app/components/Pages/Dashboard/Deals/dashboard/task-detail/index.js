import React from 'react'
import { connect } from 'react-redux'
import Header from './header'
import Documents from '../documents'
import Upload from '../upload'

import Comments from '../comments'
import CommentInput from '../comments/input'

const TaskManager = ({ deal, task, checklist }) => {
  const isWebkit = 'WebkitAppearance' in document.documentElement.style

  if (!task) {
    return false
  }

  return (
    <div className="full-width" data-simplebar={!isWebkit || null}>
      <Upload disableClick deal={deal}>
        <div className="scrollable" id="deals-task-scrollable">
          <Header deal={deal} key={task.id} task={task} />

          <Documents deal={deal} task={task} checklist={checklist} />

          <Comments deal={deal} task={task} />
        </div>

        <CommentInput key={task.id} deal={deal} task={task} />
      </Upload>
    </div>
  )
}

function mapStateTopProps({ deals }, { taskId }) {
  const { tasks, checklists } = deals

  const task = taskId ? tasks[taskId] : null
  const checklist = task ? checklists[task.checklist] : null

  return {
    task,
    checklist
  }
}

export default connect(mapStateTopProps)(TaskManager)
