import React from 'react'

import './styles/main.scss'
import Task from './components/Task'

export default function TasksTimeLine({ tasks, handleOnClick }) {
  return (
    <div className="c-tasks-timeline">
      {tasks.length === 0 ? (
        <div className="empty-list">
          <img
            alt="notepad"
            src="/static/images/contacts/notepad-edit-231.svg"
          />
          <p>There are no task yet</p>
        </div>
      ) : (
        tasks.map(task => (
          <Task task={task} onClick={handleOnClick} key={`task_${task.id}`} />
        ))
      )}
    </div>
  )
}
