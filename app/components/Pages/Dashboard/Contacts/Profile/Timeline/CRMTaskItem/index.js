import React from 'react'

import ConfirmationModalContext from 'components/ConfirmationModal/context'
import { updateTask } from 'models/tasks/update-task'

import { Container } from './styled'

export class CRMTaskItem extends React.Component {
  state = {
    disabled: false
  }

  static contextType = ConfirmationModalContext

  handleStatus = async () => {
    try {
      this.setState({ disabled: true })

      const { task } = this.props

      const [shouldUpdate, newTask] = await new Promise(resolve => {
        // Change task due date to now if user is marking it as done
        const dueDate = new Date(task.due_date * 1000)
        const now = new Date()

        if (dueDate <= now || task.status === 'DONE') {
          return resolve([
            true,
            {
              ...task,
              status: task.status === 'DONE' ? 'PENDING' : 'DONE'
            }
          ])
        }

        this.context.setConfirmationModal({
          message: 'Heads up!',
          description:
            'If you mark this event as done, the event due date will change to now. Are you sure?',
          onConfirm: () => {
            return resolve([
              true,
              {
                ...task,
                status: 'DONE',
                due_date: now.getTime() / 1000
              }
            ])
          },
          onCancel: () => {
            return resolve([false, null])
          }
        })
      })

      if (!shouldUpdate) {
        this.setState({ disabled: false })

        return
      }

      if (newTask.status === 'DONE' && Array.isArray(task.reminders)) {
        newTask.reminders = []
      }

      await updateTask(newTask)

      this.props.editCallback(newTask)

      this.setState({ disabled: false })
    } catch (error) {
      console.log(error)
      this.setState({ disabled: false })
      throw error
    }
  }

  handleOnClick = () => {
    this.props.onClick(this.props.task)
  }

  render() {
    return (
      <Container>
        {this.props.render({
          ...this.state,
          onEdit: this.handleOnClick,
          statusHandler: this.handleStatus
        })}
      </Container>
    )
  }
}
