import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Flex from 'styled-flex-component'

import { TextMiddleTruncate } from 'components/TextMiddleTruncate'

import { isChecklistExpanded } from 'reducers/deals/checklists'
import { setExpandChecklist } from 'actions/deals'

import { IAppState } from 'reducers'

import { ChecklistLabels } from './Labels'

import MessageAdmin from './MessageAdmin'
import { FolderOptionsMenu } from './Menu'

import { TaskRow } from './TaskRow'
import NewTaskRow from './NewTaskRow'

import { FolderContainer, Header, HeaderTitle, ItemsContainer } from '../styled'

interface Props {
  deal: IDeal
  tasks: IDealTask[]
  title: string
  checklist: IDealChecklist | null
  isBackOffice: boolean
  isFolderExpanded?: boolean
  createNewTask?: boolean
  onToggleExpand?(): void
}

export const ChecklistFolder = React.memo(
  ({
    deal,
    tasks,
    title,
    isBackOffice,
    checklist,
    isFolderExpanded = false,
    createNewTask = true,
    onToggleExpand = () => {}
  }: Props) => {
    const dispatch = useDispatch()
    const isExpanded = useSelector<IAppState, boolean>(({ deals }) => {
      return checklist
        ? isChecklistExpanded(deals.checklists, checklist.id)
        : isFolderExpanded || false
    })

    const toggleFolderOpen = () => {
      if (checklist) {
        dispatch(setExpandChecklist(checklist.id, !isExpanded))
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
            <HeaderTitle>
              <TextMiddleTruncate text={title} maxLength={100} />
            </HeaderTitle>
            <ChecklistLabels checklist={checklist} />
          </Flex>

          {checklist && (
            <Flex alignCenter>
              <MessageAdmin
                deal={deal}
                checklist={checklist}
                tasks={tasks}
                checklistName={checklist.title}
              />

              <FolderOptionsMenu
                deal={deal}
                checklist={checklist}
                isBackOffice={isBackOffice}
              />
            </Flex>
          )}
        </Header>

        <ItemsContainer isOpen={isExpanded}>
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
