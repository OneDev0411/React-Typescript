import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Field } from 'react-final-form'
import { addNotification as notify } from 'reapop'

import './styles/main.scss'

import { getTask } from '../../../../../models/tasks/get-task'
import {
  updateTask,
  createTask,
  deleteTask
} from '../../../../../store_actions/tasks'

import Title from './components/Title'
import DueDate from './components/DueDate'
import TaskType from './components/TaskType'
import Reminder from './components/Reminder'
import Description from './components/Description'
import Associations from './components/Associations'
import IconButton from '../../../../components/Button/IconButton'
import ActionButton from '../../../../components/Button/ActionButton'
import IconDelete from '../../../../components/SvgIcons/Delete/IconDelete'
import { CircleCheckbox } from '../../../../components/Input/CircleCheckbox'
import LoadSaveReinitializeForm from '../../../../utils/LoadSaveReinitializeForm'
import { goBackFromEditTask } from '../../helpers/go-back-from-edit'

import { preSaveFormat } from './helpers/pre-save-format'
import { postLoadFormat } from './helpers/post-load-format'

import { createTaskAssociation } from '../../../../../models/tasks/create-task-association'
import { deleteTaskAssociation } from '../../../../../models/tasks/delete-task-association'

const propTypes = {
  task: PropTypes.shape(),
  taskId: PropTypes.string,
  updateTask: PropTypes.func.isRequired,
  createTask: PropTypes.func.isRequired,
  deleteCallback: PropTypes.func,
  submitCallback: PropTypes.func,
  defaultAssociation: PropTypes.shape()
}

const defaultProps = {
  task: null,
  taskId: null,
  submitCallback: t => t,
  defaultAssociation: null,
  deleteCallback: goBackFromEditTask
}

class Task extends Component {
  state = {
    isDeleting: false,
    task: this.props.task
  }

  isNew = !this.props.taskId || this.props.taskId === 'new'

  load = async () => {
    let { task } = this.state
    const { taskId } = this.props

    if (task) {
      return task
    }

    if (!this.isNew) {
      try {
        task = await getTask(taskId, 'associations[]=crm_task.reminders')
        this.setState({ task })

        return task
      } catch (error) {
        return null
      }
    }

    return null
  }

  save = async task => {
    let newTask
    let action = 'created'
    const { notify, updateTask, createTask, submitCallback } = this.props

    try {
      if (task.id) {
        newTask = await updateTask(task, {
          'associations[]': 'crm_task.reminders'
        })
        action = 'updated'
      } else {
        newTask = await createTask(task)
      }

      notify({
        status: 'success',
        dismissAfter: 4000,
        title: `Task ${action}.`,
        message: `${task.title}`
      })

      return submitCallback(newTask, action)
    } catch (error) {
      throw error
    }
  }

  delete = async () => {
    const { task } = this.state
    const { notify, deleteTask, deleteCallback } = this.props

    try {
      this.setState({ isDeleting: true })
      await deleteTask(task.id)

      notify({
        status: 'success',
        dismissAfter: 4000,
        title: 'Task deleted.',
        message: `${task.title}`
      })

      deleteCallback(task.id)
    } catch (error) {
      throw error
    } finally {
      this.setState({ isDeleting: false })
    }
  }

  handleCreateAssociation = async association => {
    const { task } = this.state
    const { taskId } = this.props

    if (this.isNew) {
      return Promise.resolve()
    }

    const crm_task = taskId || (task && task.id)

    if (crm_task) {
      try {
        const newAssociation = {
          ...association,
          crm_task
        }
        const response = await createTaskAssociation(crm_task, newAssociation)

        return response
      } catch (error) {
        throw error
      }
    }

    return Promise.resolve()
  }

  handleDeleteAssociation = async associationId => {
    const { task } = this.state
    const { taskId } = this.props

    if (this.isNew) {
      return Promise.resolve()
    }

    const id = taskId || (task && task.id)

    if (id) {
      try {
        const response = await deleteTaskAssociation(id, associationId)

        return response
      } catch (error) {
        throw error
      }
    }

    return Promise.resolve()
  }

  render() {
    const { isDeleting } = this.state
    const { defaultAssociation } = this.props

    return (
      <div className="c-new-task">
        <LoadSaveReinitializeForm
          load={this.load}
          validate={validate}
          postLoadFormat={task => postLoadFormat(task, defaultAssociation)}
          preSaveFormat={preSaveFormat}
          save={this.save}
        >
          {({
            reset,
            values,
            invalid,
            pristine,
            validating,
            submitting,
            handleSubmit
          }) => (
            <form onSubmit={handleSubmit} className="c-new-task__form">
              <div className="c-new-task__header">
                {!this.isNew && (
                  <div className="c-new-task__status">
                    <Field
                      size={36}
                      name="status"
                      id="task-status"
                      component={CircleCheckbox}
                    />
                  </div>
                )}
                <Field name="title" component={Title} />
                <DueDate selectedDate={values.dueDate} />
              </div>
              <div className="c-new-task__body">
                <Field name="description" component={Description} />
                <div className="c-new-task__details">
                  <TaskType />
                  <Reminder
                    dueTime={values.dueTime.value}
                    dueDate={values.dueDate.value}
                    selectedDate={values.reminderDate}
                  />
                </div>
                <Associations
                  associations={values.associations}
                  handleCreate={this.handleCreateAssociation}
                  handleDelete={this.handleDeleteAssociation}
                  defaultAssociation={defaultAssociation}
                />
              </div>
              <div
                className="c-new-task__footer"
                style={
                  !this.isNew
                    ? {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }
                    : {}
                }
              >
                {!this.isNew &&
                  (!isDeleting ? (
                    <IconButton
                      type="button"
                      color="#78909c"
                      hoverColor="#2196f3"
                      onClick={this.delete}
                    >
                      <IconDelete />
                    </IconButton>
                  ) : (
                    <span>
                      <i className="fa fa-spin fa-spinner" /> Deleting...
                    </span>
                  ))}
                {/*
                  This is temporary until implemention of bulk
                  delete/add associations and attachments
                */}
                {this.isNew && (
                  <button
                    type="button"
                    onClick={reset}
                    disabled={submitting || pristine || isDeleting}
                    className="c-new-address-modal__cancel-btn"
                  >
                    Cancel
                  </button>
                )}
                <ActionButton
                  type="submit"
                  disabled={(!invalid && pristine) || isDeleting}
                  style={{ marginLeft: '0.5em' }}
                >
                  {submitting || validating ? 'Saving...' : 'Save'}
                </ActionButton>
              </div>
            </form>
          )}
        </LoadSaveReinitializeForm>
      </div>
    )
  }
}

Task.propTypes = propTypes
Task.defaultProps = defaultProps

export default connect(null, { createTask, updateTask, deleteTask, notify })(
  Task
)

/**
 * Fields validator
 * @param {object} values The form values
 * @returns {object} invalid fields
 */
function validate(values) {
  const errors = {}
  const requiredError = 'Required'
  const timeRequiredError = 'Time is required,'

  if (values.title == null || values.title.trim().length === 0) {
    errors.title = requiredError
  }

  if (values.dueTime.value == null) {
    errors.dueTime = timeRequiredError
  }

  if (values.reminderDate.value && values.reminderTime.value == null) {
    errors.reminderTime = timeRequiredError
  }

  return errors
}
