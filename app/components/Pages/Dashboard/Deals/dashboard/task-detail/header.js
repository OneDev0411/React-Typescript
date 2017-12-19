import React from 'react'
import { connect } from 'react-redux'
import cn from 'classnames'
import { confirmation } from '../../../../../../store_actions/confirmation'
import { setSelectedTask, deleteTask, updateTask } from '../../../../../../store_actions/deals'
import TaskStatus from '../tasks/status'

class Header extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isEditingTitle: false,
      isSavingTitle: false
    }
  }

  requestDeleteTask(task) {
    this.props.confirmation({
      message: 'Delete this task?',
      description: 'You cannot undo this action',
      confirmLabel: 'Yes, Delete',
      onConfirm: () => this.deleteTask(task)
    })
  }

  deleteTask(task) {
    const { setSelectedTask, deleteTask } = this.props

    deleteTask(task.checklist, task.id)
    setSelectedTask(null)
  }

  onKeyPress(e) {
    if (e.which === 13) {
      e.preventDefault()
      this.onSave(e)
    }
  }

  toggleEdit() {
    this.setState({
      isEditingTitle: !this.state.isEditingTitle
    })
  }

  async onSave(e) {
    const { task } = this.props

    // stop propagation
    e.stopPropagation()

    const title = this.titleInput.value

    if (title === task.title || title.length === 0) {
      return this.toggleEdit()
    }

    this.setState({
      isSavingTitle: true,
      isEditingTitle: false
    })

    await this.props.updateTask(task.id, {
      title
    })

    this.setState({ isSavingTitle: false })
  }

  render() {
    const { isSavingTitle, isEditingTitle } = this.state
    const { task, setSelectedTask } = this.props

    return (
      <div className="header">
        <div className="top">
          <div className="task-status">
            <TaskStatus task={task} />
          </div>

          <div className="cta">
            <span
              className="delete-task"
              onClick={() => this.requestDeleteTask(task)}
              title="Delete Task"
            >
              <img src="/static/images/deals/trashcan.png" />
            </span>

            <span
              className="close-task"
              onClick={() => setSelectedTask(null)}
              title="Close Task"
            >
              <img src="/static/images/deals/close.png" />
            </span>
          </div>
        </div>

        {
          isSavingTitle ?
          <div className="saving-title">
            <i className="fa fa-spin fa-spinner" />
          </div> :
          <div
            className={cn('title', { isEditingTitle })}
            onClick={() => this.toggleEdit()}
          >
            {
              isEditingTitle ?
              <div className="cta">
                <span
                  className="save"
                  onClick={e => this.onSave(e)}
                >
                  Save
                </span>
              </div> :
              <div className="cta">
                <i className="fa fa-pencil" />
              </div>
            }

            {
              isEditingTitle ?
              <textarea
                autoFocus
                onClick={e => e.stopPropagation()}
                defaultValue={task.title}
                onKeyPress={e => this.onKeyPress(e)}
                ref={ref => this.titleInput = ref}
              /> :
              <span>{task.title}</span>
            }
          </div>
        }
      </div>
    )
  }
}

export default connect(null, {
  setSelectedTask,
  deleteTask,
  updateTask,
  confirmation
})(Header)
