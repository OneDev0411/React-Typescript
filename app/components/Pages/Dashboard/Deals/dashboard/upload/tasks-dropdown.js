import React from 'react'
import { connect } from 'react-redux'
import cn from 'classnames'
import { addNotification as notify } from 'reapop'
import { Dropdown, MenuItem, Button } from 'react-bootstrap'
import { setUploadAttributes, createFormTask } from '../../../../../../store_actions/deals'

class DropDownTasks extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showMenu: false,
      newTaskMode: false,
      isCreatingTask: false
    }
  }

  toggleMenu() {
    if (this.state.newTaskMode) {
      return false
    }

    this.setState({
      showMenu: !this.state.showMenu
    })
  }

  onSelectTask(taskId) {
    this.props.onSelectTask(taskId)
    this.toggleMenu()
  }

  async createNewTask(e, checklistId) {
    const { upload, notify, createFormTask, onSelectTask } = this.props

    if (e.which !== 13) {
      return false
    }

    const taskTitle = this.inputNewTask.value

    if (taskTitle.length === 0) {
      return this.setState({ newTaskMode: null })
    }

    this.setState({
      isCreatingTask: true
    })

    // create task
    const task = await createFormTask(upload.deal.id, null, taskTitle, checklistId)

    notify({
      message: `Task "${taskTitle}" created.`,
      status: 'success'
    })

    this.setState({
      isCreatingTask: false,
      newTaskMode: false,
      showMenu: false
    }, () => onSelectTask(task.id))
  }

  render() {
    const { showMenu, newTaskMode, isCreatingTask } = this.state
    const { shouldDropUp, selectedTask, upload, checklists, tasks } = this.props

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
          { (selectedTask && selectedTask.title) || 'Select a task' }
        </Button>

        <Dropdown.Menu className="deal-task-dropdown-list">
          {
            upload.deal.checklists.map((chId, key) => {
              const checklist = checklists[chId]
              return (
                <div key={chId}>

                  <div className="checklist">
                    { checklist.title }
                  </div>

                  {
                    checklist.tasks &&
                    checklist.tasks.map((tId, key) =>
                      <li
                        key={tId}
                        className={cn({
                          selected: selectedTask && selectedTask.id === tId
                        })}
                        onClick={() => this.onSelectTask(tId)}
                      >
                        { tasks[tId].title }
                      </li>
                    )
                  }

                  {
                    (newTaskMode && newTaskMode === chId) ?
                    <li>
                      {
                        isCreatingTask ?
                        <span className="creating-task">
                          Creating task ...
                        </span> :
                        <input
                          className="new-task"
                          placeholder="Name this task and press enter"
                          ref={ref => this.inputNewTask = ref}
                          onKeyPress={e => this.createNewTask(e, chId)}
                          onBlur={() => this.setState({ newTaskMode: null })}
                          autoFocus
                        />
                      }
                    </li> :
                    <li
                      className="new-task"
                      onClick={() => this.setState({ newTaskMode: chId })}
                    >
                      Add new task to { checklist.title }
                    </li>
                  }
                </div>
              )
            })
          }
        </Dropdown.Menu>
      </Dropdown>
    )
  }
}

function mapStateToProps({ deals }) {
  return {
    upload: deals.upload,
    checklists: deals.checklists,
    tasks: deals.tasks
  }
}

export default connect(mapStateToProps, {
  notify,
  createFormTask,
  setUploadAttributes
})(DropDownTasks)
