import React from 'react'
import { connect } from 'react-redux'
import Flex from 'styled-flex-component'

import { TextMiddleTruncate } from 'components/TextMiddleTruncate'

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

interface DispatchProps {
  setExpandChecklist(checklistId: UUID, isFolderExpanded: boolean): void
}

interface StateProps {
  isFolderExpanded: boolean
}

interface Props {
  deal: IDeal
  tasks: IDealTask[]
  title: string
  checklist: IDealChecklist
  isBackOffice: boolean
  createNewTask?: boolean
  onToggleExpand(): void
}

const ChecklistFolder = React.memo(
  ({
    deal,
    tasks,
    title,
    isBackOffice,
    checklist,
    isFolderExpanded,
    setExpandChecklist,
    createNewTask = true,
    onToggleExpand = () => {}
  }: Props & StateProps & DispatchProps) => {
    const toggleFolderOpen = () => {
      if (checklist) {
        setExpandChecklist(checklist.id, !isFolderExpanded)
      }

      onToggleExpand()
    }

    return (
      <FolderContainer>
        <Header>
          <Flex
            alignCenter
            style={{ cursor: 'pointer' }}
            onClick={toggleFolderOpen}
          >
            <ArrowIcon isOpen={isFolderExpanded} />
            <HeaderTitle>
              <TextMiddleTruncate text={title} maxLength={100} />
            </HeaderTitle>
            <ChecklistLabels checklist={checklist} />
          </Flex>

          {checklist && (
            <Flex alignCenter>
              {/*
              // @ts-ignore TODO: js component */}
              <MessageAdmin
                deal={deal}
                checklist={checklist}
                tasks={tasks}
                checklistName={checklist.title}
              />

              {/*
              // @ts-ignore TODO: js component */}
              <Menu
                deal={deal}
                checklist={checklist}
                isBackOffice={isBackOffice}
              />
            </Flex>
          )}
        </Header>

        <ItemsContainer isOpen={isFolderExpanded}>
          {tasks.map(task => (
            <TaskRow
              key={task.id}
              task={task}
              deal={deal}
              isBackOffice={isBackOffice}
            />
          ))}

          {createNewTask && <NewTaskRow deal={deal} checklist={checklist} />}
        </ItemsContainer>
      </FolderContainer>
    )
  }
)

function mapStateToProps({ deals }, props) {
  return {
    isFolderExpanded: props.checklist
      ? isChecklistExpanded(deals.checklists, props.checklist.id)
      : props.isFolderExpanded || false
  }
}

export default connect(
  mapStateToProps,
  { setExpandChecklist }
)(ChecklistFolder)
