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

      const updatedEvent = {
        ...this.props.task,
        status: this.props.task.status === 'DONE' ? 'PENDING' : 'DONE'
      }

      this.props.editCallback(updatedEvent)

      await updateTask(updatedEvent)

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

// todo: feching contact for updating last_touch after updated a task.
