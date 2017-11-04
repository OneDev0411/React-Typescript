import React from 'react'
import { connect } from 'react-redux'
import { addTask, deleteTask, editTask } from '../../../../../store_actions/brandConsole'
import { Button } from 'react-bootstrap'
import Compose from './ModalTask'
import { compose, withState, pure } from 'recompose'

const enhance = compose(
  pure,
  withState('activeItem', 'onSelectItem'),
)
const Tasks = ({
  checklist,
  addTask,
  deleteTask,
  activeItem,
  onSelectItem,
  editTask
}) => {
  const AddButton = ({
    clickHandler
  }) =>
    (<Button
      className="button"
      onClick={() => clickHandler()}
    >
      Add Task
    </Button>)
  const EditButton = ({
    clickHandler
  }) =>
    (<Button
      className="button edit-button"
      onClick={() => clickHandler()}
    >
      Edit Task
    </Button>)

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
        <Compose
          onSelectItem={onSelectItem}
          TriggerButton={EditButton}
          showOnly={false}
          dropDownBox
          title="Edit Checklist"
          buttonTitle="Edit"
          task={task}
          activeItem={activeItem === task.id}
          allowed_forms={checklist.allowed_forms}
          onButtonClick={(editedTask) => {
            editTask(checklist, { ...task, ...editedTask })
          }}
        />
      </div>
    )}
  </div>
}

export default connect(
  null,
  ({ addTask, deleteTask, editTask })
)(enhance(Tasks))