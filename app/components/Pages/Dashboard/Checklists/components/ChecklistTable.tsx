import React, { useContext } from 'react'
import {
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@material-ui/core'
import classNames from 'classnames'

import ConfirmationModalContext from 'components/ConfirmationModal/context'

import IconDeleteOutline from 'components/SvgIcons/DeleteOutline/IconDeleteOutline'

import { useDictionary } from 'hooks/use-dictionary'

import { useTableStyles } from '../../../../../styles/table.style'
import { dealTaskTypeToString } from '../constants'

interface Props {
  checklist: IBrandChecklist
  updateTask: (task: IDealTask) => void
  deleteTask: (checklistId: string, taskId: string) => void
}

export function CheckListTable({ checklist, updateTask, deleteTask }: Props) {
  const [isTaskRemoving, setTaskRemoving] = useDictionary<boolean>()

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
        {(checklist.tasks || []).map(task => (
          <TableRow key={task.id}>
            <TableCell>{task.title}</TableCell>
            <TableCell>
              {dealTaskTypeToString[task.task_type] || 'Unknown'}
            </TableCell>
            <TableCell>
              <Checkbox
                color="primary"
                checked={task.required}
                onChange={event =>
                  updateTask({
                    ...task,
                    required: event.target.checked
                  })
                }
              />
            </TableCell>
            <TableCell>
              <IconButton
                disabled={isTaskRemoving(task.id)}
                onClick={() => {
                  confirmationModal.setConfirmationModal({
                    message: 'Remove Task?',
                    description: `Are you sure you want to remove ${
                      task.title ? `"${task.title}"` : 'this task'
                    }?`,
                    confirmLabel: 'Yes, Remove it',
                    onConfirm: async () => {
                      setTaskRemoving(task.id, true)
                      await new Promise(resolve => setTimeout(resolve, 2000))
                      await deleteTask(checklist.id, task.id)
                      setTaskRemoving(task.id, false)
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
