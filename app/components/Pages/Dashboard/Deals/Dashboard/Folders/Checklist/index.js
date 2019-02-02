import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import Flex from 'styled-flex-component'

import { TextMiddleTruncate } from 'components/TextMiddleTruncate'

import { selectChecklistTasks } from 'reducers/deals/tasks'

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
    return this.SortedTasks.filter(task => task.task_type !== 'GeneralComments')
  }

  get SortedTasks() {
    return this.props.tasks
    // if (this.props.isBackOffice) {
    //   return _.sortBy(this.props.tasks, task =>
    //     task.attention_requested ? 0 : 1
    //   )
    // }

    // return _.sortBy(
    //   this.props.tasks,
    //   task => new Date(task.updated_at).getTime() * -1
    // )
  }

  render() {
    return (
      <FolderContainer>
        <Header>
          <Flex
            alignCenter
            style={{ cursor: 'pointer' }}
            onClick={this.toggleFolderOpen}
          >
            <ArrowIcon isOpen={this.state.isFolderExpanded} />
            <HeaderTitle>
              <TextMiddleTruncate
                text={this.props.checklist.title}
                maxLength={100}
              />
            </HeaderTitle>
            <ChecklistLabels checklist={this.props.checklist} />
          </Flex>

          <Flex alignCenter>
            <MessageAdmin
              checklist={this.props.checklist}
              tasks={this.props.tasks}
            />
            <Menu
              deal={this.props.deal}
              checklist={this.props.checklist}
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

          <NewTaskRow deal={this.props.deal} checklist={this.props.checklist} />
        </ItemsContainer>
      </FolderContainer>
    )
  }
}

export default connect(({ deals }, props) => ({
  tasks: selectChecklistTasks(props.checklist, deals.tasks)
}))(ChecklistFolder)
