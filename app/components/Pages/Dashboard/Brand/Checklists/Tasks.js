import React from 'react'
import { connect } from 'react-redux'
import { addTask, deleteTask } from '../../../../../store_actions/brandConsole'
import { Button } from 'react-bootstrap'
import Compose from './ModalTask'

const Tasks = ({
                 checklist,
                 addTask,
                 deleteTask
               }) => {
  const AddButton = ({
                       clickHandler
                     }) =>
    (
      <Button
        // bsStyle="primary"
        className="button"
        onClick={() => clickHandler()}
      >
        Add Task
      </Button>
    )
  return <div
    className="tasks"
  >
    <div className="tasks-header">
      <div className="label">Task</div>
      <Compose
        TriggerButton={AddButton}
        showOnly={false}
        dropDownBox
        inline
        title="Add Task"
        buttonTitle="Add"
        allowed_forms={checklist.allowed_forms}
        onButtonClick={(newItem) => {
          addTask(checklist.brand, checklist.id, newItem)
        }}
      />
    </div>
    {checklist.tasks && checklist.tasks.map(task =>
      <div
        className="task clearfix"
        key={`task${task.id}`}
      >
        <p className="task-title">
          {task.title}
        </p>
        <i
          onClick={(e) => {
            e.stopPropagation()
            deleteTask(checklist, task.id)
          }}
          className="fa fa-times delete-icon"
          aria-hidden="true"
        />
      </div>
    )}
  </div>
}

export default connect(
  null,
  ({ addTask, deleteTask })
)(Tasks)