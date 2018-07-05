import React from 'react'

import OverlayDrawer from '../../../../../views/components/OverlayDrawer'
import CreateTask from '../../../../../views/CRM/Tasks/components/NewTask'

const TaskDrawer = ({ isOpen, selectedTask, onClose, onChangeTask }) => (
  <OverlayDrawer
    isOpen={isOpen}
    width={50}
    showFooter={false}
    onClose={onClose}
  >
    <OverlayDrawer.Header title={selectedTask ? 'Edit Task' : 'Add Task'} />
    <OverlayDrawer.Body>
      {isOpen && (
        <CreateTask
          className="overlay-drawer"
          submitCallback={onChangeTask}
          deleteCallback={(id, task) => onChangeTask(task)}
          taskId={selectedTask}
        />
      )}
    </OverlayDrawer.Body>
  </OverlayDrawer>
)

export default TaskDrawer
