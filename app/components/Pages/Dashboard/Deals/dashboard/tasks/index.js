import React from 'react'
import { connect } from 'react-redux'
import cn from 'classnames'
import CreateTask from '../create-task'
import TaskStatus from './status'
import ChecklistPanel from '../checklists/panel'

const List = ({
  tasks,
  rooms,
  checklist,
  dealId,
  selectedTaskId,
  onSelectTask,
  isBackoffice
}) => {

  if (!checklist) {
    return false
  }

  return (
    <ChecklistPanel
      checklist={checklist}
      dealId={dealId}
    >
      <div className={`list ${!checklist.tasks ? 'empty' : ''}`}>
        {
          checklist.tasks &&
          checklist.tasks
          .map((id, key) => {
            const task = tasks[id]
            const room = rooms[task.room.id] || task.room
            const hasStatus = !!task.review

            return (
              <div
                key={`TASK_${id}_${key}`}
                onClick={() => onSelectTask(task)}
                className={cn('task', {
                  'active': selectedTaskId === id,
                  'no-status': !hasStatus
                })}
              >
                <div className="icon" />
                <div className="title">
                  { task.title }
                </div>

                {
                  hasStatus &&
                  <TaskStatus
                    task={task}
                  />
                }

                <span
                  className={cn('notification', {
                    has_notification: room.new_notifications > 0
                  })}
                />
              </div>
            )
          })
        }

        <CreateTask
          dealId={dealId}
          listId={checklist.id}
        />
      </div>
    </ChecklistPanel>
  )
}

export default connect(({ deals, chatroom }) => ({
  rooms: chatroom.rooms,
  tasks: deals.tasks
}))(List)
