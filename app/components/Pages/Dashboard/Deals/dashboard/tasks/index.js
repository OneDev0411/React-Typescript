import React from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { connect } from 'react-redux'
import cn from 'classnames'
import CreateTask from '../create-task'
import TaskStatus from './status'
import ChecklistPanel from '../checklists/panel'
import {
  setSelectedTask,
  updateDealNotifications
} from '../../../../../../store_actions/deals'

import { isBackOffice } from '../../../../../../utils/user-teams'

const List = ({
  tasks,
  rooms,
  checklist,
  deal,
  selectedTask,
  setSelectedTask,
  updateDealNotifications,
  isBackOffice
}) => {
  if (!checklist) {
    return false
  }

  let sortedTasks = checklist.tasks

  // select a task
  function selectTask(task) {
    if (task.room.new_notifications > 0) {
      updateDealNotifications(
        deal.id,
        deal.new_notifications - task.room.new_notifications
      )
    }

    setSelectedTask(task)
  }

  // sort tasks of backoffice, based on notified flag. they gonna show first.
  if (isBackOffice && checklist.tasks) {
    sortedTasks = _.sortBy(
      checklist.tasks,
      id => (tasks[id].attention_requested ? 0 : 1)
    )
  }

  return (
    <ChecklistPanel checklist={checklist} deal={deal}>
      <div className={`list ${!checklist.tasks ? 'empty' : ''}`}>
        <TransitionGroup>
          {sortedTasks &&
            sortedTasks.map(id => {
              const task = tasks[id]
              const room =
                rooms && rooms[task.room.id] ? rooms[task.room.id] : task.room
              const hasStatus =
                task.review !== null || task.attention_requested === true

              return (
                <CSSTransition
                  timeout={{
                    enter: 1000,
                    exit: 800
                  }}
                  classNames="fade"
                  key={`TASK_${id}`}
                >
                  <div
                    onClick={() => selectTask(task)}
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
                  </div>
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
  ({ deals, chatroom, user }) => ({
    rooms: chatroom.rooms,
    tasks: deals.tasks,
    selectedTask: deals.properties.selectedTask,
    isBackOffice: isBackOffice(user)
  }),
  { setSelectedTask, updateDealNotifications }
)(List)
