import React from 'react'
import { connect } from 'react-redux'
import { Modal, Button, DropdownButton, MenuItem } from 'react-bootstrap'

class Wrapper extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showComposeModal: false,
      titleTask: props.task && props.task.title,
      taskType: props.task && props.task.task_type,
      allowedForm: (props.task && props.task.form) ? props.task.form : {},
      order: props.task && props.task.order
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.task
      && nextProps.activeItem
    ) {
      this.setState({
        titleTask: nextProps.task.title,
        taskType: nextProps.task.task_type,
        allowedForm: nextProps.forms[nextProps.task.form] || {},
        order: nextProps.task.order
      })
    }
  }

  onChangeComposeModal = showComposeModal => this.setState({ showComposeModal })
  changeTitleTask = titleTask => this.setState({ titleTask })
  changeTaskType = taskType => this.setState({ taskType })
  changeAllowedForm = allowedForm => this.setState({ allowedForm })
  changeTitleOrder = order => this.setState({ order })

  render() {
    return <ModalNewTask
      {...this.props}
      showComposeModal={this.state.showComposeModal}
      titleTask={this.state.titleTask}
      taskType={this.state.taskType}
      allowedForm={this.state.allowedForm}
      order={this.state.order}
      onChangeComposeModal={this.onChangeComposeModal}
      changeTitleTask={this.changeTitleTask}
      changeTaskType={this.changeTaskType}
      changeAllowedForm={this.changeAllowedForm}
      changeTitleOrder={this.changeTitleOrder}
    />
  }
}

const ModalNewTask = ({
  TriggerButton,
  title,
  buttonTitle,
  onButtonClick,
  inline = false,
  forms,
  allowed_forms,
  /* internal props and states */
  showComposeModal,
  onChangeComposeModal,
  titleTask,
  changeTitleTask,
  taskType,
  changeTaskType,
  order,
  changeTitleOrder,
  allowedForm,
  changeAllowedForm,
  task,
  onSelectItem
}) => {
  const taskTypes = [
    'Form', 'Generic'
  ]

  return <div style={{ display: inline ? 'inline' : 'block' }}>
    <TriggerButton
      clickHandler={() => {
        if (task)
          onSelectItem(task.id)

        onChangeComposeModal(!showComposeModal)
      }}
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
            value={titleTask}
            type="text"
            placeholder="Write a task name…"
            onChange={(event) => changeTitleTask(event.target.value)}
          />
        </div>
        <div className="title">Task Type</div>
        <DropdownButton
          id="taskType"
          title={taskType || 'Choose a task type'}
          onSelect={(selectedItem) => changeTaskType(selectedItem)}
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
            {forms && allowed_forms && allowed_forms.map((item, i) =>
              (
                <MenuItem
                  key={i}
                  eventKey={item}
                >{forms[item] && forms[item].name}
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
            value={order}
            placeholder="order…"
            onChange={(event) => changeTitleOrder(event.target.value)}
          />
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button
          bsStyle="primary"
          onClick={() => {
            onChangeComposeModal(false)
            onButtonClick({
              title: titleTask,
              task_type: taskType,
              order,
              form: allowedForm.id
            })
          }}
        >
          {buttonTitle}
        </Button>
      </Modal.Footer>
    </Modal>
  </div>
}
export default connect(({ deals }) => ({
  forms: deals.forms
})
)(Wrapper)