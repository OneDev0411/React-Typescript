import React from 'react'

export default ({
  tasks
}) => (
  <div className="deal-tasks">
    {
      tasks && tasks.map(task => (
        <div
          className="task"
          key={`TASK_${task.id}`}
        >
          <span className={`status ${task.status}`}></span>
          <div className="info">
            <div className="title">{ task.title }</div>
            <div className="subtitle">Subtitle goes here</div>
          </div>

        </div>
      ))
    }
  </div>
)
