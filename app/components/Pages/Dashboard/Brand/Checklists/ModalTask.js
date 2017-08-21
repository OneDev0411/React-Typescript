import React from 'react'
import { Modal, Button, DropdownButton, MenuItem } from 'react-bootstrap'
import { compose, withState, pure } from 'recompose'

const enhance = compose(
  pure,
  withState('showComposeModal', 'onChangeComposeModal', false),
  withState('titleTask', 'changeTitleTask', ''),
  withState('taskType', 'changeTitleDealType', ''),
  withState('allowedForm', 'changeAllowedForm', ''),
  withState('titleOrder', 'changeTitleOrder', ''),
)

const ModalNewTask = ({
                        TriggerButton,
                        title,
                        buttonTitle,
                        onButtonClick,
                        inline = false,
                        showOnly = false,
                        forms,
                        /* internal props and states */
                        showComposeModal,
                        onChangeComposeModal,
                        titleTask,
                        changeTitleTask,
                        taskType,
                        changeTitleDealType,
                        titleOrder,
                        changeTitleOrder,
                        allowedForm,
                        changeAllowedForm
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
            <MenuItem
              key={item}
              eventKey={item}
            >{item}
            </MenuItem>
          )}
        </DropdownButton>
        { taskType === 'Form' &&
        <div>
          <div className="title">Select Form</div>
          <DropdownButton
            id="form"
            title={taskType || 'Choose a allowed form'}
            onSelect={(selectedItem) => changeTitleDealType(selectedItem)}
          >
            {forms && forms.map(item =>
              <MenuItem
                key={item}
                eventKey={item}
              >{item}
              </MenuItem>
            )}
          </DropdownButton>
        </div>
        }
        <div className="title">Order</div>

        <div className="input-container">
          <input
            type="text"
            placeholder="order…"
            onChange={(event) => changeAllowedForm(event.target.value)}
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
              form: allowedForm
            })
          }}
        >
          {buttonTitle}
        </Button>
      </Modal.Footer>}
    </Modal>
  </div>
}
export default enhance(ModalNewTask)
