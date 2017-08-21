import React from 'react'
import { Modal, Button, DropdownButton, MenuItem } from 'react-bootstrap'
import { compose, withState, pure } from 'recompose'

const enhance = compose(
  pure,
  withState('showComposeModal', 'onChangeComposeModal', false),
  withState('titleTask', 'changeTitleTask', ''),
  withState('taskType', 'changeTitleDealType', ''),
  withState('titleOrder', 'changeTitleOrder', ''),
)

const ComposeWrapper = ({
                          TriggerButton,
                          title,
                          buttonTitle,
                          onButtonClick,
                          inline = false,
                          showOnly = false,
                          /* internal props and states */
                          showComposeModal,
                          onChangeComposeModal,
                          titleTask,
                          changeTitleTask,
                          taskType,
                          changeTitleDealType,
                          titleOrder,
                          changeTitleOrder
                        }) => {
  const taskTypes = [
    'Form', 'Generic'
  ]
  const orders = [
    '1', '2', '3'
  ]
  return <div style={{ display: inline ? 'inline' : 'block' }}>
    <TriggerButton
      clickHandler={() => onChangeComposeModal(!showComposeModal)}
    />

    <Modal
      show={showComposeModal}
      dialogClassName="modal-checklist"
      onHide={() => onChangeComposeModal(false)}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {title}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="title">Task Name</div>
        <div className="input-container">
          <input
            type="text"
            placeholder="Write a task name…"
            onChange={(event) => changeTitleTask(event.target.value)}
          />
        </div>
        <div className="title">Task Type</div>
        <DropdownButton
          id="taskType"
          title={taskType || 'Choose a task type'}
          onSelect={(selectedItem) => changeTitleDealType(selectedItem)}
        >
          {taskTypes.map(item =>
            <MenuItem eventKey={item}>{item}</MenuItem>
          )}
        </DropdownButton>
        <div className="title">Order</div>

        <div className="input-container">
          <input
            type="text"
            placeholder="order…"
            onChange={(event) => changeTitleOrder(event.target.value)}
          />
        </div>
      </Modal.Body>

      {!showOnly &&
      <Modal.Footer>
        <Button
          bsStyle="primary"
          disabled={!titleTask || !taskType || !titleOrder}
          onClick={() => {
            onChangeComposeModal(false)
            onButtonClick({
              title: titleTask,
              task_type: taskType,
              order: titleOrder,
              // form: results.form.create.data.id
            })
          }}
        >
          {buttonTitle}
        </Button>
      </Modal.Footer>}
    </Modal>
  </div>
}
export default enhance(ComposeWrapper)
