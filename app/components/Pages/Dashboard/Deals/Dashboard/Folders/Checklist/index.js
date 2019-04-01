import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import Flex from 'styled-flex-component'

import { TextMiddleTruncate } from 'components/TextMiddleTruncate'

import { selectChecklistTasks } from 'reducers/deals/tasks'
import { isChecklistExpanded } from 'reducers/deals/checklists'
import { setExpandChecklist } from 'actions/deals'

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

const ChecklistFolder = React.memo(props => {
  const toggleFolderOpen = () => {
    props.setExpandChecklist(props.checklist.id, !props.isFolderExpanded)
  }

  return (
    <FolderContainer>
      <Header>
        <Flex
          alignCenter
          style={{ cursor: 'pointer' }}
          onClick={toggleFolderOpen}
        >
          <ArrowIcon isOpen={props.isFolderExpanded} />
          <HeaderTitle>
            <TextMiddleTruncate text={props.checklist.title} maxLength={100} />
          </HeaderTitle>
          <ChecklistLabels checklist={props.checklist} />
        </Flex>

        <Flex alignCenter>
          <MessageAdmin
            deal={props.deal}
            checklist={props.checklist}
            tasks={props.tasks}
            checklistName={props.checklist.title}
          />
          <Menu
            deal={props.deal}
            checklist={props.checklist}
            isBackOffice={props.isBackOffice}
          />
        </Flex>
      </Header>

      <ItemsContainer isOpen={props.isFolderExpanded}>
        {props.tasks
          .filter(task => task.task_type !== 'GeneralComments')
          .map(task => (
            <TaskRow
              key={task.id}
              task={task}
              deal={props.deal}
              isBackOffice={props.isBackOffice}
            />
          ))}

        <NewTaskRow deal={props.deal} checklist={props.checklist} />
      </ItemsContainer>
    </FolderContainer>
  )
})

function mapStateToProps({ deals }, props) {
  return {
    isFolderExpanded: isChecklistExpanded(deals.checklists, props.checklist.id),
    tasks: selectChecklistTasks(props.checklist, deals.tasks)
  }
}

export default connect(
  mapStateToProps,
  { setExpandChecklist }
)(ChecklistFolder)
