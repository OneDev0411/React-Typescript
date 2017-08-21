import React from 'react'
import { connect } from 'react-redux'
import { addTask } from '../../../../../store_actions/brandConsole'
import { Button } from 'react-bootstrap'
import Compose from './ModalTask'

const Tasks = ({
                 checklist,
                 addTask
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
        onButtonClick={(newItem) => {
          addTask(checklist.id, newItem)
        }}
      />
    </div>
    {checklist.tasks && checklist.tasks.map(task =>
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
}

export default connect(
  null,
  ({ addTask })
)(Tasks)