import React from 'react'
import cn from 'classnames'
import _ from 'underscore'

export default ({
  tasks,
  section,
  selectedTask,
  onSelectTask
}) => (
  <div className="section">
    <span className="title">
      { section.tag }
    </span>

    <button className="add-task">
      <i className="fa fa-plus" />Add New
    </button>

    <div className="list">
      {
        tasks && tasks
        .filter(task => task.tags && task.tags.indexOf(section.id) > -1)
        .map(task =>
          <div
            key={`TASK_${task.id}`}
            onClick={() => onSelectTask(task)}
            className={cn('task', { active: selectedTask === task.id })}
          >
            <div className="title">{ task.title }</div>
            <div className="description">
              Approved by Shayan, June 21, 17 at 2:03pm
            </div>

            <span className="status">
              Approved
            </span>
          </div>
        )
      }
    </div>
  </div>
)
