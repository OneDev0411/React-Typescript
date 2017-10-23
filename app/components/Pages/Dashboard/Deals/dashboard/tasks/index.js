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
  deal,
  selectedTaskId,
  onSelectTask,
  isBackOffice
}) => {

  if (!checklist) {
    return false
  }

  return (
    <ChecklistPanel
      checklist={checklist}
      deal={deal}
    >
      <div className={`list ${!checklist.tasks ? 'empty' : ''}`}>
        {
          checklist.tasks &&
          checklist.tasks
          .sort(id => {
            if (!isBackOffice) {
              return 0
            }

            const task = tasks[id]
            return task.needs_attention === true ? -1 : 1
          })
          .map((id, key) => {
            const task = tasks[id]
            const room = rooms[task.room.id] || task.room
            const hasStatus = task.review !== null || task.needs_attention === true

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
          dealId={deal.id}
          listId={checklist.id}
        />
      </div>
    </ChecklistPanel>
  )
}

export default connect(({ deals, chatroom }) => ({
  rooms: chatroom.rooms,
  tasks: deals.tasks,
  isBackOffice: deals.backoffice
}))(List)
