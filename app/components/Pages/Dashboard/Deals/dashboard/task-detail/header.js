import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import cn from 'classnames'
import {
  updateTask,
  setSelectedTask
} from '../../../../../../store_actions/deals'
import TaskStatus from '../tasks/status'
import DeleteTask from './delete-task'

class Header extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isEditingTitle: false,
      isSavingTitle: false
    }
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
    const { deal, task, setSelectedTask } = this.props

    return (
      <div className="header">
        <div className="top">
          <div className="task-status">
            <TaskStatus task={task} isDraft={deal.is_draft} />
          </div>

          <div className="cta">
            <DeleteTask deal={deal} task={task} />

            <span
              className="close-task"
              onClick={() => setSelectedTask(null)}
              title="Close Task"
            >
              <img src="/static/images/deals/close.png" alt="" />
            </span>
          </div>
        </div>

        {isSavingTitle ? (
          <div className="saving-title">
            <i className="fa fa-spin fa-spinner" />
          </div>
        ) : (
          <div
            className={cn('title', { isEditingTitle })}
            onClick={() => this.toggleEdit()}
          >
            {!isEditingTitle && (
              <Fragment>
                <span>{task.title}</span>
                <div className="cta">
                  <i className="fa fa-pencil" />
                </div>
              </Fragment>
            )}

            {isEditingTitle && (
              <Fragment>
                <textarea
                  autoFocus
                  onClick={e => e.stopPropagation()}
                  defaultValue={task.title}
                  onKeyPress={e => this.onKeyPress(e)}
                  ref={ref => (this.titleInput = ref)}
                />
                <div className="cta">
                  <div className="save" onClick={e => this.onSave(e)}>
                    Save
                  </div>
                </div>
              </Fragment>
            )}
          </div>
        )}
      </div>
    )
  }
}

export default connect(
  null,
  {
    updateTask,
    setSelectedTask
  }
)(Header)
