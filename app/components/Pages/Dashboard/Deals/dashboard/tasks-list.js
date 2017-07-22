import React from 'react'
import CreateTask from './create-task'

export default ({
  tasks,
  tags,
  activeTag
}) => (
  <div className="deal-tasks">
    <CreateTask
      tags={tags}
      activeTag={activeTag}
    />

    {
      tasks && tasks
      .filter(task => task.tags.indexOf(activeTag) > -1)
      .map(task => (
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
