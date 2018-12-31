import React from 'react'

import IconAdd from 'components/SvgIcons/AddCircleOutline/IconAddCircleOutline'

import TaskCreate from '../../../components/TaskCreate'

import { Button, Container, Title } from './styled'

class NewTaskRow extends React.Component {
  state = {
    showCreateTaskDrawer: false
  }

  toggleCreateTaskDrawer = () =>
    this.setState(state => ({
      showCreateTaskDrawer: !state.showCreateTaskDrawer
    }))

  render() {
    return (
      <Container>
        <Button style={{ padding: 0 }} onClick={this.toggleCreateTaskDrawer}>
          <IconAdd />
          <Title>Add Checkist Item</Title>
        </Button>

        <TaskCreate
          deal={this.props.deal}
          checklist={this.props.checklist}
          isOpen={this.state.showCreateTaskDrawer}
          onClose={this.toggleCreateTaskDrawer}
        />
      </Container>
    )
  }
}

export default NewTaskRow
