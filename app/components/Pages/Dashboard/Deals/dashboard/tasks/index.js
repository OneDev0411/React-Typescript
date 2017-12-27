import React from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
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
    sortedTasks = _.sortBy(
      checklist.tasks,
      id => (tasks[id].needs_attention ? 0 : 1)
    )
  }

  return (
    <ChecklistPanel checklist={checklist} deal={deal}>
      <div className={`list ${!checklist.tasks ? 'empty' : ''}`}>
        <TransitionGroup>
          {sortedTasks &&
            sortedTasks.map((id, key) => {
              const task = tasks[id]
              const room = rooms[task.room.id] || task.room
              const hasStatus = task.review !== null || task.needs_attention === true

              return (
                <CSSTransition
                  timeout={{
                    enter: 1000,
                    exit: 800
                  }}
                  classNames="fade"
                  key={`TASK_${id}`}
                >
                  <button
                    onClick={() => setSelectedTask(task)}
                    className={cn('task', {
                      active: selectedTask && selectedTask.id === id,
                      'no-status': !hasStatus
                    })}
                  >
                    <div className="icon" />
                    <div className="title">{task.title}</div>

                    {hasStatus && <TaskStatus task={task} />}

                    {room.new_notifications > 0 && (
                      <div className="notification">
                        <img
                          alt="comments"
                          src="/static/images/deals/comments.svg"
                        />
                        <span>{room.new_notifications}</span>
                      </div>
                    )}
                  </button>
                </CSSTransition>
              )
            })}
        </TransitionGroup>

        <CreateTask deal={deal} listId={checklist.id} />
      </div>
    </ChecklistPanel>
  )
}

export default connect(
  ({ deals, chatroom }) => ({
    rooms: chatroom.rooms,
    tasks: deals.tasks,
    selectedTask: deals.selectedTask,
    isBackOffice: deals.backoffice
  }),
  { setSelectedTask }
)(List)
