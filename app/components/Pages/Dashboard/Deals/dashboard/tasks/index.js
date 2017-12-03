import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { connect } from 'react-redux'
import cn from 'classnames'
import CreateTask from '../create-task'
import TaskStatus from './status'
import ChecklistPanel from '../checklists/panel'
import { setSelectedTask } from '../../../../../../store_actions/deals'

const List = ({
  tasks,
  rooms,
  checklist,
  deal,
  selectedTask,
  setSelectedTask,
  isBackOffice
}) => {

  if (!checklist) {
    return false
  }

  let sortedTasks = checklist.tasks

  // sort tasks of backoffice, based on notified flag. they gonna show first.
  if (isBackOffice && checklist.tasks) {
    sortedTasks = _.sortBy(checklist.tasks, (id) => tasks[id].needs_attention ? 0 : 1)
  }

  return (
    <ChecklistPanel
      checklist={checklist}
      deal={deal}
    >
      <div className={`list ${!checklist.tasks ? 'empty' : ''}`}>
        <ReactCSSTransitionGroup
          transitionName="tasks"
          transitionEnterTimeout={1000}
          transitionLeaveTimeout={800}
        >
          {
            sortedTasks &&
            sortedTasks
            .map((id, key) => {
              const task = tasks[id]
              const room = rooms[task.room.id] || task.room
              const hasStatus = task.review !== null || task.needs_attention === true

              return (
                <div
                  key={`TASK_${id}`}
                  onClick={() => setSelectedTask(task)}
                  className={cn('task', {
                    'active': selectedTask && selectedTask.id === id,
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

                  {
                    room.new_notifications > 0 &&
                    <div className="notification">
                      <img src="/static/images/deals/comments.svg" />
                      <span>{room.new_notifications}</span>
                    </div>
                  }

                </div>
              )
            })
          }
        </ReactCSSTransitionGroup>

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
  selectedTask: deals.selectedTask,
  isBackOffice: deals.backoffice
}), { setSelectedTask })(List)
