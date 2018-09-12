import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'
import cn from 'classnames'
import Flex from 'styled-flex-component'

import { getTask } from '../../../../../models/tasks/get-task'
import {
  updateTask,
  createTask,
  deleteTask
} from '../../../../../store_actions/tasks'
import { createTaskAssociation } from '../../../../../models/tasks/create-task-association'
import { deleteTaskAssociation } from '../../../../../models/tasks/delete-task-association'

// import IconButton from '../../../../components/Button/IconButton'
import ActionButton from '../../../../components/Button/ActionButton'
// import IconDelete from '../../../../components/SvgIcons/Delete/IconDelete'
import { TextAreaField } from '../../../../components/final-form-fields'

import LoadSaveReinitializeForm from '../../../../utils/LoadSaveReinitializeForm'
import { goBackFromEditTask } from '../../helpers/go-back-from-edit'

import { preSaveFormat } from './helpers/pre-save-format'
import { postLoadFormat } from './helpers/post-load-format'

import { Title } from './components/Title'
import DueDate from './components/DueDate'
// import Reminder from './components/Reminder'
import { TaskType } from './components/TaskType'
import { AssociationsCTA } from './components/AssociationsCTA'
import { FormContainer, FieldContainer } from './styled'

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
      const query = 'associations[]=crm_task.reminders'

      if (task.id) {
        newTask = await updateTask(task, query)
        action = 'updated'
      } else {
        newTask = await createTask(task, query)
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

      deleteCallback(task.id, task)
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
    const { defaultAssociation, className } = this.props

    return (
      <div className={cn('c-new-task', className)}>
        <LoadSaveReinitializeForm
          load={this.load}
          validate={validate}
          postLoadFormat={task => postLoadFormat(task, defaultAssociation)}
          preSaveFormat={preSaveFormat}
          save={this.save}
        >
          {props => {
            const { values } = props

            return (
              <FormContainer onSubmit={props.handleSubmit}>
                <Title />
                {props.dirty && (
                  <Flex
                    justifyBetween
                    alignCenter
                    style={{ marginBottom: '1.5em' }}
                  >
                    <TaskType />
                    <FieldContainer
                      justifyBetween
                      alignCenter
                      style={{ marginLeft: '1em', flex: 2 }}
                    >
                      <DueDate selectedDate={values.dueDate} />
                    </FieldContainer>
                  </Flex>
                )}
                <Flex justifyBetween alignCenter>
                  <AssociationsCTA
                    addHandler={ass => {
                      console.log(ass)
                    }}
                  />
                  {props.dirty && (
                    <ActionButton type="submit" disabled={isDeleting}>
                      {props.submitting || props.validating
                        ? 'Saving...'
                        : 'Save'}
                    </ActionButton>
                  )}
                </Flex>
              </FormContainer>
            )
          }}
        </LoadSaveReinitializeForm>
      </div>
    )
  }
}

Task.propTypes = propTypes
Task.defaultProps = defaultProps

export default connect(
  null,
  { createTask, updateTask, deleteTask, notify }
)(Task)

/**
 * Fields validator
 * @param {object} values The form values
 * @returns {object} invalid fields
 */
function validate(values) {
  const errors = {}
  const timeRequiredError = 'Time is required'

  if (values.dueTime.value == null) {
    errors.dueTime = timeRequiredError
  }

  if (values.reminderDate.value && values.reminderTime.value == null) {
    errors.reminderTime = timeRequiredError
  }

  return errors
}
