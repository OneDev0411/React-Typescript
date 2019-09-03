import React from 'react'
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

import IconDelete from 'components/SvgIcons/Delete/IconDelete'

import { useTableStyles } from '../../../../../styles/table.style'

interface Props {
  checklist: IBrandChecklist
  updateTask: (task: IDealTask) => void
  deleteTask: (taskId: string) => void
}

export function CheckListTable({ checklist, updateTask, deleteTask }: Props) {
  const tableClasses = useTableStyles()

  return (
    <Table
      size="small"
      className={classNames(tableClasses.stripedRows, tableClasses.darkHeader)}
    >
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Type</TableCell>
          <TableCell>Required?</TableCell>
          <TableCell />
        </TableRow>
      </TableHead>
      <TableBody>
        {(checklist.tasks || []).map(task => (
          <TableRow key={task.id}>
            <TableCell>{task.title}</TableCell>
            <TableCell>{task.task_type}</TableCell>
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
              <IconButton onClick={() => deleteTask(task.id)}>
                <IconDelete />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
