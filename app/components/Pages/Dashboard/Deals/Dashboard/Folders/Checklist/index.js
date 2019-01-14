import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import Flex from 'styled-flex-component'

import { ChecklistLabels } from './Labels'
import MessageAdmin from './MessageAdmin'
import Menu from './Menu'

import TaskRow from './TaskRow'
import NewTaskRow from './NewTaskRow'

import {
  FolderContainer,
  Header,
  HeaderTitle,
  ItemsContainer,
  ArrowIcon
} from '../styled'

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
    return this.SortedTasks.filter(this.canShowTask).map(
      id => this.props.tasks[id]
    )
  }

  get SortedTasks() {
    const { tasks } = this.props.checklist
    let sortedTasks = tasks

    if (this.props.isBackOffice && tasks) {
      sortedTasks = _.sortBy(tasks, id =>
        this.props.tasks[id].attention_requested ? 0 : 1
      )
    }

    return sortedTasks
  }

  canShowTask = id =>
    this.props.tasks[id].title.includes('General Comments') === false

  render() {
    const { checklist } = this.props

    return (
      <FolderContainer>
        <Header>
          <Flex
            alignCenter
            style={{ cursor: 'pointer' }}
            onClick={this.toggleFolderOpen}
          >
            <ArrowIcon isOpen={this.state.isFolderExpanded} />
            <HeaderTitle>{checklist.title}</HeaderTitle>
            <ChecklistLabels checklist={checklist} />
          </Flex>

          <Flex alignCenter>
            <MessageAdmin checklist={checklist} tasks={this.props.tasks} />
            <Menu
              deal={this.props.deal}
              checklist={checklist}
              isBackOffice={this.props.isBackOffice}
            />
          </Flex>
        </Header>

        <ItemsContainer isOpen={this.state.isFolderExpanded}>
          {this.Tasks.map(task => (
            <TaskRow
              key={task.id}
              task={task}
              deal={this.props.deal}
              isBackOffice={this.props.isBackOffice}
            />
          ))}

          <NewTaskRow deal={this.props.deal} checklist={checklist} />
        </ItemsContainer>
      </FolderContainer>
    )
  }
}

export default connect(({ deals }) => ({
  tasks: deals.tasks
}))(ChecklistFolder)
