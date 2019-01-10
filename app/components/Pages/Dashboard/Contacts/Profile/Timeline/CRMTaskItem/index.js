import React from 'react'

import { updateTask } from '../../../../../../../models/tasks/update-task'

import { Container } from './styled'

export class CRMTaskItem extends React.Component {
  state = {
    disabled: false
  }

  handleStatus = async () => {
    try {
      this.setState({ disabled: true })

      const { task } = this.props
      const status = task.status === 'DONE' ? 'PENDING' : 'DONE'

      const newTask = {
        ...task,
        status
      }

      if (status === 'DONE' && Array.isArray(task.reminders)) {
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
