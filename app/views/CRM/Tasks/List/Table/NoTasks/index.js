import React from 'react'
import ActionButton from '../../../../../components/Button/ActionButton'
import IconTodo from '../../../../../components/SvgIcons/Todo/IconTodo'
import OverlayDrawer from '../../../../../components/OverlayDrawer'
import NewTask from '../../../components/NewTask'

export default class NoTasks extends React.Component {
  state = {
    showCreateTask: false
  }

  toggleShowCreateTask = () =>
    this.setState(state => ({
      showCreateTask: !state.showCreateTask
    }))

  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        <IconTodo style={{ width: 112, height: 112, fill: '#8DA2B5' }} />
        <h2 style={{ color: '#62778c', margin: '0 0 0.5em' }}>
          Looks like you don’t have any tasks.
        </h2>

        <ActionButton onClick={this.toggleShowCreateTask}>
          Create Task
        </ActionButton>

        <OverlayDrawer
          isOpen={this.state.showCreateTask}
          width={50}
          showFooter={false}
          onClose={this.toggleShowCreateTask}
        >
          <OverlayDrawer.Header title="Add Task" />
          <OverlayDrawer.Body>
            <NewTask
              className="overlay-drawer"
              submitCallback={this.toggleShowCreateTask}
              deleteCallback={this.toggleShowCreateTask}
            />
          </OverlayDrawer.Body>
        </OverlayDrawer>
      </div>
    )
  }
}
