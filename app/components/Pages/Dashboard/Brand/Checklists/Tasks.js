import React from 'react'
import { connect } from 'react-redux'
import { addTask } from '../../../../../store_actions/brandConsole'
import { button } from 'react-bootstrap'

const Tasks = ({
                 deleteChecklist,
                 onSelectItem,
                 Checklist,
                 activeItem
               }) =>
  (
    <div
      className="tasks"
    >
      <div className="tasks-header">
        <div className="label">Task</div>
        <button className="button">Add Task</button>
      </div>
      {Checklist.tasks && Checklist.tasks.map(task =>
        <div
          className="task"
          key={`task${task.id}`}
        >
          <p className="task-title">
            {task.title}
          </p>
        </div>
      )}
    </div>
  )

export default connect(
  ({ brandConsole, data }, { Checklist }) => ({
    tasks: brandConsole.tasks[Checklist.id] || []
    // user: data.user
  }),
  ({ addTask })
)(Tasks)