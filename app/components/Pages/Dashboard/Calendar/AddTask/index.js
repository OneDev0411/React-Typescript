import React, { Fragment } from 'react'

import ActionButton from '../../../../../views/components/Button/ActionButton'
import FullScreenModal from '../../../../../views/components/FullScreenModal'

import CreateTask from '../../../../../views/CRM/Tasks/components/NewTask'

export default class AddTask extends React.Component {
  state = {
    showModal: false
  }

  toggleModal = () => this.setState({ showModal: !this.state.showModal })
  onNewTask = task => {
    this.props.onNewTask(task)

    setTimeout(() => {
      this.toggleModal()
    }, 500)
  }

  render() {
    const { showModal } = this.state

    return (
      <Fragment>
        <FullScreenModal
          title="Create Task"
          isOpen={showModal}
          handleClose={this.toggleModal}
        >
          <CreateTask submitCallback={this.onNewTask} />
        </FullScreenModal>
        <ActionButton inverse onClick={this.toggleModal}>
          Add Task
        </ActionButton>
      </Fragment>
    )
  }
}
