import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'

import { ChecklistLabels } from './Labels'
import MessageAdmin from './MessageAdmin'

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

  /**
   * returns sorted tasks of current checklist.
   * and GeneralComments task is ommitted
   * Every Checklist *has one* GeneralComments task
   * We hide this task from tasks table and show that as a "Message Admin" cta
   * inside the checklist table
   */
  get Tasks() {
    return this.SortedTasks.filter(this.isFormTask).map(
      id => this.props.tasks[id]
    )
  }

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

  isFormTask = id =>
    this.props.tasks[id].task_type === 'Form' &&
    this.props.tasks[id].title.includes('General Comments') === false

  render() {
    const { checklist } = this.props

    return (
      <Container>
        <Header>
          <HeaderLeftColumn onClick={this.toggleFolderOpen}>
            <ArrowIcon isOpen={this.state.isFolderExpanded} />

            <HeaderTitle>{checklist.title}</HeaderTitle>

            <ChecklistLabels checklist={checklist} />
          </HeaderLeftColumn>

          <MessageAdmin checklist={checklist} tasks={this.props.tasks} />
        </Header>

        <TasksContainer isOpen={this.state.isFolderExpanded}>
          {this.Tasks.map(task => (
            <TaskRow
              key={task.id}
              task={task}
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
