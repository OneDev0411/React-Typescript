import React from 'react'

import './styles/main.scss'
import Task from './components/Task'

export default function TasksTimeLine({ tasks }) {
  return (
    <div className="c-tasks-timeline">
      {tasks.length === 0 ? (
        <div className="no-note">
          <img
            alt="notepad"
            src="/static/images/contacts/notepad-edit-231.svg"
          />
          <p>There are no task yet</p>
        </div>
      ) : (
        tasks.map(task => <Task task={task} key={`task_${task.id}`} />)
      )}
    </div>
  )
}
