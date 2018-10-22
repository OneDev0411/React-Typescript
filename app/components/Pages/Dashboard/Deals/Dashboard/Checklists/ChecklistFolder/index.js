import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'

import Labels from './Labels'
import TaskRow from '../TaskRow'

import {
  Container,
  Header,
  HeaderLeftColumn,
  HeaderTitle,
  TasksContainer,
  ArrowIcon
} from './styled'

class ChecklistFolder extends React.Component {
  state = {
    isFolderExpanded: true
  }

  toggleFolderOpen = () =>
    this.setState(state => ({
      isFolderExpanded: !state.isFolderExpanded
    }))

  get SortedTasks() {
    const { tasks } = this.props.checklist
    let sortedTasks = tasks

    if (this.props.isBackOffice && tasks) {
      sortedTasks = _.sortBy(
        tasks,
        id => (this.props.tasks[id].attention_requested ? 0 : 1)
      )
    }

    return sortedTasks
  }

  render() {
    const { checklist } = this.props

    return (
      <Container>
        <Header>
          <HeaderLeftColumn onClick={this.toggleFolderOpen}>
            <ArrowIcon isOpen={this.state.isFolderExpanded} />

            <HeaderTitle>{checklist.title}</HeaderTitle>
          </HeaderLeftColumn>

          <Labels checklist={checklist} />
        </Header>

        <TasksContainer isOpen={this.state.isFolderExpanded}>
          {this.SortedTasks.map(id => (
            <TaskRow
              key={id}
              task={this.props.tasks[id]}
              deal={this.props.deal}
              isBackOffice={this.props.isBackOffice}
            />
          ))}
        </TasksContainer>
      </Container>
    )
  }
}

export default connect(({ deals }) => ({
  tasks: deals.tasks
}))(ChecklistFolder)
