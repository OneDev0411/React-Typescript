import React from 'react'
import cn from 'classnames'
import CreateTask from '../create-task'

export default ({
  tasks,
  section,
  dealId,
  selectedTask,
  onSelectTask
}) => {
  return (
    <div className="section">
      <span className="title">
        { section.title }
      </span>

      <CreateTask
        dealId={dealId}
        listId={section.id}
      />

      <div className="list">
        {
          tasks && tasks
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
                { task.review ? task.review.status : 'Incomplete' }
              </span>
            </div>
          )
        }
      </div>
    </div>
  )
}
