import React from 'react'
import { connect } from 'react-redux'
import cn from 'classnames'
import CreateTask from '../create-task'
import TaskStatus from './status'

const List = ({
  tasks,
  section,
  dealId,
  selectedTaskId,
  onSelectTask
}) => {
  if (!section) {
    return false
  }

  return (
    <div className="section">
      <span className="title">
        { section.title }
      </span>

      <CreateTask
        dealId={dealId}
        listId={section.id}
      />

      <div className={`list ${!section.tasks ? 'empty' : ''}`}>
        {
          section.tasks &&
          section.tasks
          .map((id, key) => {
            const task = tasks[id]

            return (
              <div
                key={`TASK_${id}_${key}`}
                onClick={() => onSelectTask(task)}
                className={cn('task', { active: selectedTaskId === id })}
              >
                <div className="title">{ task.title.replace(/&.*;/g, '') }</div>
                <TaskStatus task={task} />
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default connect(({ deals }) => ({
  tasks: deals.tasks
}))(List)

