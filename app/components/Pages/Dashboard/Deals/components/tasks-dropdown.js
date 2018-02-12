import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import cn from 'classnames'
import { addNotification as notify } from 'reapop'
import { Dropdown, Button } from 'react-bootstrap'
import { createFormTask } from '../../../../../store_actions/deals'
import TaskForms from '../dashboard/create-task/form/forms-list'

class DropDownTasks extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showMenu: false,
      newTaskMode: false,
      newFormMode: null,
      filter: '',
      isCreatingTask: false,
      taskTitle: ''
    }
  }

  toggleMenu() {
    const { newTaskMode, newFormMode } = this.state

    if (newTaskMode || newFormMode) {
      return false
    }

    this.setState({
      showMenu: !this.state.showMenu
    })
  }

  onSelectTask(taskId) {
    this.props.onSelectTask(taskId)
    this.toggleMenu()

    this.setState({
      filter: ''
    })
  }

  onKeyPress(e, checklistId) {
    if (e.which === 13) {
      this.createNewTask(checklistId)
    }
  }

  discardEdit() {
    const { isCreatingTask, taskTitle } = this.state

    if (isCreatingTask || taskTitle.length > 0) {
      return false
    }

    this.setState({ newTaskMode: false })
  }

  onTaskTitleChange(value) {
    this.setState({
      taskTitle: value
    })
  }

  toggleNewFormMode(chId) {
    this.setState({ newFormMode: chId })
  }

  onChangeFilter(filter) {
    const { selectedTask, onSelectTask } = this.props

    this.setState({ filter })

    if (selectedTask) {
      onSelectTask(null)
    }
  }

  async createNewTask(checklistId) {
    const { deal, notify, createFormTask, onSelectTask } = this.props
    const { taskTitle } = this.state

    if (taskTitle.length === 0) {
      return this.discardEdit()
    }

    this.setState({
      isCreatingTask: true
    })

    // create task
    const task = await createFormTask(deal.id, null, taskTitle, checklistId)

    notify({
      message: `Task "${taskTitle}" created.`,
      status: 'success'
    })

    this.setState(
      {
        taskTitle: '',
        isCreatingTask: false,
        newTaskMode: false,
        showMenu: false
      },
      () => onSelectTask(task.id)
    )
  }

  render() {
    const {
      showMenu,
      newTaskMode,
      newFormMode,
      isCreatingTask,
      taskTitle,
      filter
    } = this.state
    const {
      deal,
      shouldDropUp,
      selectedTask,
      checklists,
      tasks,
      searchable
    } = this.props

    return (
      <Dropdown
        id="deal-tasks-dropdown"
        dropup={shouldDropUp}
        open={showMenu}
        onToggle={() => this.toggleMenu()}
      >
        <Button
          className="deal-task-dropdown"
          bsRole="toggle"
          onClick={e => e.stopPropagation()}
        >
          {searchable ? (
            <input
              placeholder="Document Title"
              value={filter || (selectedTask && selectedTask.title) || ''}
              onChange={e => this.onChangeFilter(e.target.value)}
            />
          ) : (
            (selectedTask && selectedTask.title) || 'Select a task'
          )}

          <span className="indicator">
            <i className={`fa fa-caret-${showMenu ? 'up' : 'down'}`} />
          </span>
        </Button>

        <Dropdown.Menu className="deal-task-dropdown-list">
          {deal.checklists.map(chId => {
            const checklist = checklists[chId]

            return (
              <div key={chId}>
                <div className="checklist">{checklist.title}</div>

                {checklist.tasks &&
                  checklist.tasks
                    .filter(tId =>
                      tasks[tId].title
                        .toLowerCase()
                        .includes(filter.toLowerCase())
                    )
                    .map(tId => (
                      <li
                        key={tId}
                        className={cn({
                          selected: selectedTask && selectedTask.id === tId
                        })}
                        onClick={() => this.onSelectTask(tId)}
                      >
                        {tasks[tId].title}
                      </li>
                    ))}

                {newTaskMode && newTaskMode === chId ? (
                  <li>
                    {isCreatingTask ? (
                      <span className="creating-task">Creating task ...</span>
                    ) : (
                      <div className="create-task-input">
                        <input
                          className="new-task"
                          placeholder="Name this task and press enter"
                          onChange={e => this.onTaskTitleChange(e.target.value)}
                          value={taskTitle}
                          onKeyPress={e => this.onKeyPress(e, chId)}
                          onBlur={e => this.discardEdit(e)}
                          autoFocus
                        />

                        <span
                          className="save"
                          onClick={() => this.createNewTask(chId)}
                        >
                          {taskTitle ? 'Save' : 'Cancel'}
                        </span>
                      </div>
                    )}
                  </li>
                ) : (
                  <Fragment>
                    <li
                      className="new-task"
                      onClick={() => this.toggleNewFormMode(chId)}
                    >
                      Add new form to {checklist.title}
                    </li>

                    <li
                      className="new-task"
                      onClick={() => this.setState({ newTaskMode: chId })}
                    >
                      Add new task to {checklist.title}
                    </li>

                    <TaskForms
                      deal={deal}
                      listId={checklist.id}
                      show={newFormMode === chId}
                      onClose={() => this.toggleNewFormMode(null)}
                      onTaskCreate={task => this.onSelectTask(task.id)}
                    />
                  </Fragment>
                )}
              </div>
            )
          })}
        </Dropdown.Menu>
      </Dropdown>
    )
  }
}

function mapStateToProps({ deals }) {
  return {
    checklists: deals.checklists,
    tasks: deals.tasks
  }
}

export default connect(mapStateToProps, {
  notify,
  createFormTask
})(DropDownTasks)
