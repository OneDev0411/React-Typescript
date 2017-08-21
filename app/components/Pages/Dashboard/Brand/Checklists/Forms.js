import React from 'react'
import { connect } from 'react-redux'
import { addTask } from '../../../../../store_actions/brandConsole'
import { Button } from 'react-bootstrap'
import Compose from './ModalTask'
import ListFilter from './ListFilter'
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
        Add Form
      </Button>
    )
  let data = ['Boston', 'Palo Alto', 'Columbus']
  return <div
    className="tasks"
  >
    <div className="tasks-header">
      <div className="label">Allowed forms in this checklist</div>
      <Button
        // bsStyle="primary"
        className="button"
        onClick={() => clickHandler()}
      >
        Add Form
      </Button>
      <ListFilter
        parentClassName="listFilter"
        ulClassName="listFilter-results"
        liClassName="listFilter-results-item"
        inputContainerClassName="listFilter-input-container"
        inputClassName="listFilter-input"
        placeholder="Type in to search…"
        data={data}
      />
    </div>
    {checklist.allowed_forms && checklist.allowed_forms.map(task =>
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