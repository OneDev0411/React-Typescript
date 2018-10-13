import React from 'react'

import { updateTask } from '../../../../../../../store_actions/tasks/update-task'

import { Container } from './styled'
import { connect } from 'react-redux'

class CRMTaskItemComponent extends React.Component {
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

      await this.props.updateTask(updatedEvent)

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

const CRMTaskItem = connect(
  null,
  { updateTask }
)(CRMTaskItemComponent)

export { CRMTaskItem }

// todo: feching contact for updating last_touch after updated a task.
