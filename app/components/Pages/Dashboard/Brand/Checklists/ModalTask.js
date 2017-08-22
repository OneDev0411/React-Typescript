import React from 'react'
import { connect } from 'react-redux'
import { Modal, Button, DropdownButton, MenuItem } from 'react-bootstrap'
import { compose, withState, pure } from 'recompose'

const enhance = compose(
  pure,
  withState('showComposeModal', 'onChangeComposeModal', false),
  withState('titleTask', 'changeTitleTask', ''),
  withState('taskType', 'changeTitleDealType', ''),
  withState('allowedForm', 'changeAllowedForm', {}),
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
                        allowed_forms,
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
            title={allowedForm.name || 'Choose a allowed form'}
            onSelect={(selectedItem) => changeAllowedForm(forms[selectedItem])}
          >
            {allowed_forms && allowed_forms.map((item, i) =>
              (
                <MenuItem
                  key={i}
                  eventKey={item}
                >{forms[item].name}
                </MenuItem>
            )
            )}
          </DropdownButton>
        </div>
        }
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
          disabled={!titleTask || !taskType || !titleOrder || !(taskType === 'Form' && Object.keys(allowedForm).length !== 0)}
          onClick={() => {
            onChangeComposeModal(false)
            onButtonClick({
              title: titleTask,
              task_type: taskType,
              order: titleOrder,
              form: allowedForm.id
            })
          }}
        >
          {buttonTitle}
        </Button>
      </Modal.Footer>}
    </Modal>
  </div>
}
export default connect(({ deals }) => ({
  forms: deals.forms
})
)(enhance(ModalNewTask))