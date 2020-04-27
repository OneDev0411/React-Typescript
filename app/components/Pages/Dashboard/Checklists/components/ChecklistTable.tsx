import React, { RefObject, useContext } from 'react'
import {
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core'
import classNames from 'classnames'

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
  const [isRemoving, setRemoving] = useDictionary<boolean>()
  const [isRequiredChanging, setRequiredChanging] = useDictionary<boolean>()

  const tableClasses = useTableStyles()

  const confirmationModal = useContext(ConfirmationModalContext)

  return (
    <Table
      size="small"
      className={classNames(tableClasses.stripedRows, tableClasses.darkHeader)}
    >
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Type</TableCell>
          <TableCell style={{ width: 1 }}>Required?</TableCell>
          <TableCell style={{ width: 1 }} />
        </TableRow>
      </TableHead>
      <TableBody>
        {(checklist.tasks || []).map((task, index) => (
          <TableRow key={task.id}>
            <TableCell>
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
                  <Typography color="textSecondary">Unnamed Task</Typography>
                )}
              </InlineEditableString>
            </TableCell>
            <TableCell>
              {dealTaskTypeToString[task.task_type] || 'Unknown'}
            </TableCell>
            <TableCell>
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
            <TableCell>
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
        ))}
      </TableBody>
    </Table>
  )
}
