import React, { RefObject, useContext } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import type {
  DroppableProvided,
  DraggableProvided,
  DraggableStateSnapshot,
  DropResult
} from 'react-beautiful-dnd'

import {
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Theme
} from '@material-ui/core'
import classNames from 'classnames'

import { useTheme } from '@material-ui/styles'

import ConfirmationModalContext from 'components/ConfirmationModal/context'

import IconDeleteOutline from 'components/SvgIcons/DeleteOutline/IconDeleteOutline'

import { useDictionary } from 'hooks/use-dictionary'

import { InlineEditableString } from 'components/inline-editable-fields/InlineEditableString'

import { useTableStyles } from '../../../../../styles/table.style'
import { dealTaskTypeToString } from '../constants'

interface Props {
  checklist: IBrandChecklist
  updateTask: (task: IBrandChecklistTask) => void
  deleteTask: (checklistId: string, taskId: string) => void
  lastTaskNameEditorRef?: RefObject<any>
}

export function CheckListTable({
  checklist,
  updateTask,
  deleteTask,
  lastTaskNameEditorRef
}: Props) {
  const theme = useTheme<Theme>()
  const [isRemoving, setRemoving] = useDictionary<boolean>()
  const [isRequiredChanging, setRequiredChanging] = useDictionary<boolean>()

  const tableClasses = useTableStyles()

  const confirmationModal = useContext(ConfirmationModalContext)

  const onDragEnd = (result: DropResult) => {
    console.log(result)
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Table
        size="small"
        className={classNames(
          tableClasses.stripedRows,
          tableClasses.darkHeader
        )}
      >
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Type</TableCell>
            <TableCell style={{ width: 1 }}>Required?</TableCell>
            <TableCell style={{ width: 1 }} />
          </TableRow>
        </TableHead>

        <Droppable droppableId="checklists-table">
          {(droppableProvided: DroppableProvided) => (
            <TableBody
              ref={droppableProvided.innerRef}
              {...droppableProvided.droppableProps}
            >
              {(checklist.tasks || []).map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(
                    provided: DraggableProvided,
                    snapshot: DraggableStateSnapshot
                  ) => (
                    <TableRow
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        ...(snapshot.isDragging
                          ? {
                              display: 'table',
                              backgroundColor: theme.palette.action.selected
                            }
                          : {})
                      }}
                    >
                      <TableCell
                        style={{
                          width: '65%'
                        }}
                      >
                        <InlineEditableString
                          {...(Array.isArray(checklist.tasks) &&
                          index === checklist.tasks.length - 1
                            ? { ref: lastTaskNameEditorRef }
                            : {})}
                          value={task.title}
                          TextFieldProps={{
                            fullWidth: true,
                            style: {
                              maxWidth: '30rem'
                            }
                          }}
                          onSave={title =>
                            updateTask({
                              ...task,
                              title
                            })
                          }
                        >
                          {task.title || (
                            <Typography color="textSecondary">
                              Unnamed Task
                            </Typography>
                          )}
                        </InlineEditableString>
                      </TableCell>
                      <TableCell
                        style={{
                          width: '15%'
                        }}
                      >
                        {dealTaskTypeToString[task.task_type] || 'Unknown'}
                      </TableCell>
                      <TableCell
                        style={{
                          width: '10%'
                        }}
                      >
                        <Checkbox
                          disabled={isRequiredChanging(task.id)}
                          color="primary"
                          checked={task.required}
                          onChange={async event => {
                            setRequiredChanging(task.id, true)
                            await updateTask({
                              ...task,
                              required: event.target.checked
                            })
                            setRequiredChanging(task.id, false)
                          }}
                        />
                      </TableCell>
                      <TableCell
                        style={{
                          width: '10%'
                        }}
                      >
                        <IconButton
                          disabled={isRemoving(task.id)}
                          onClick={() => {
                            confirmationModal.setConfirmationModal({
                              message: 'Remove Task?',
                              description: `Are you sure you want to remove ${
                                task.title ? `"${task.title}"` : 'this task'
                              }?`,
                              confirmLabel: 'Yes, Remove it',
                              onConfirm: async () => {
                                setRemoving(task.id, true)
                                await deleteTask(checklist.id, task.id)
                                setRemoving(task.id, false)
                              }
                            })
                          }}
                        >
                          <IconDeleteOutline style={{ fill: 'currentColor' }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )}
                </Draggable>
              ))}

              {droppableProvided.placeholder}
            </TableBody>
          )}
        </Droppable>
      </Table>
    </DragDropContext>
  )
}
