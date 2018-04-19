import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import cn from 'classnames'
import { addNotification as notify } from 'reapop'
import { Dropdown, Button } from 'react-bootstrap'
import { createFormTask } from '../../../../../store_actions/deals'

class DropDownTasks extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showMenu: false,
      newTaskMode: false,
      filter: '',
      isCreatingTask: false,
      taskTitle: ''
    }
  }

  toggleMenu() {
    const { newTaskMode } = this.state

    if (newTaskMode) {
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

  async onSelectFormTask(checklistId, form) {
    const { deal, onSelectTask, createFormTask } = this.props

    onSelectTask(null)
    this.toggleMenu()

    this.setState({
      filter: form.name.trim()
    })

    const task = await createFormTask(deal.id, form.id, form.name, checklistId)

    onSelectTask(task.id)

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

  onChangeFilter(filter) {
    const { selectedTask, onSelectTask } = this.props

    this.setState({ filter: filter.trim() })

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

  getSearchValue() {
    const { filter } = this.state
    const { selectedTask, showStashOption } = this.props

    if (filter) {
      return filter
    } else if (selectedTask) {
      return selectedTask.title.trim()
    } else if (selectedTask === null && showStashOption) {
      return 'Upload directly to my Files'
    }

    return ''
  }

  render() {
    const {
      showMenu,
      newTaskMode,
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
      searchable,
      showStashOption,
      stashOptionText,
      placeholder = 'Folder'
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
              placeholder={placeholder}
              value={this.getSearchValue()}
              onChange={e => this.onChangeFilter(e.target.value)}
            />
          ) : (
            (selectedTask && selectedTask.title) || filter || 'Select a task'
          )}

          <span className="indicator">
            <i className={`fa fa-caret-${showMenu ? 'up' : 'down'}`} />
          </span>
        </Button>

        <Dropdown.Menu className="deal-task-dropdown-list">
          {showStashOption && (
            <li
              className={cn('is-bold', {
                selected: selectedTask === null
              })}
              onClick={e => {
                e.stopPropagation()
                this.onSelectTask(null)
              }}
            >
              {stashOptionText || 'Upload directly to my Files'}
            </li>
          )}

          {deal.checklists.map(chId => {
            const checklist = checklists[chId]

            return (
              <Fragment key={chId}>
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
                        onClick={e => {
                          e.stopPropagation()
                          this.onSelectTask(tId)
                        }}
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
                          className="input-new-task"
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
                    {_.chain(checklist.allowed_forms)
                      .filter(form => {
                        const isFormExists = _.find(
                          checklist.tasks,
                          id => tasks[id].form === form.id
                        )

                        return (
                          typeof isFormExists === 'undefined' &&
                          form.name.toLowerCase().includes(filter.toLowerCase())
                        )
                      })
                      .map(form => (
                        <li
                          key={form.id}
                          onClick={e => {
                            e.stopPropagation()
                            this.onSelectFormTask(checklist.id, form)
                          }}
                        >
                          {form.name}
                        </li>
                      ))
                      .value()}

                    <li
                      className="is-bold"
                      onClick={() => this.setState({ newTaskMode: chId })}
                    >
                      Add new task to {checklist.title}
                    </li>
                  </Fragment>
                )}
              </Fragment>
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
