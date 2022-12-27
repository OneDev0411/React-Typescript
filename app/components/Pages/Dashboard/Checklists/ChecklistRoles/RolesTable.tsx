import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Theme,
  Tooltip,
  Typography
} from '@material-ui/core'
import { useTheme } from '@material-ui/styles'
import { mdiDrag, mdiTrashCanOutline } from '@mdi/js'
import classNames from 'classnames'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import type {
  DroppableProvided,
  DraggableProvided,
  DraggableStateSnapshot,
  DropResult
} from 'react-beautiful-dnd'

import { reorder } from '@app/utils/dnd-reorder'
import { SvgIcon } from '@app/views/components/SvgIcons'

import { useTableStyles } from '../../../../../styles/table.style'
import { getLegalFullName } from '../../Deals/utils/roles'

import { EditRole } from './EditRole'

interface Props {
  checklist: IBrandChecklist
  onUpdateRole: (role: IBrandChecklistRole) => void
  onDeleteRole: (roleId: UUID) => void
  onReorderRoles: (roles: IBrandChecklistRole[]) => void
}

export function ChecklistRolesTable({
  checklist,
  onUpdateRole,
  onDeleteRole,
  onReorderRoles
}: Props) {
  const theme = useTheme<Theme>()

  const tableClasses = useTableStyles()

  const onDragEnd = (result: DropResult) => {
    if (
      !result.destination ||
      result.destination.index === result.source.index
    ) {
      return
    }

    const reorderedRoles = reorder<IBrandChecklistRole>(
      checklist.roles || [],
      result.source.index,
      result.destination.index
    )

    onReorderRoles(
      reorderedRoles.map((task, order) => ({
        ...task,
        order: order + 1
      }))
    )
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
            <TableCell />
            <TableCell>Name</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>

        <Droppable droppableId="checklists-table">
          {(droppableProvided: DroppableProvided) => (
            <TableBody
              ref={droppableProvided.innerRef}
              {...droppableProvided.droppableProps}
            >
              {(checklist.roles || []).map((role, index) => (
                <Draggable key={role.id} draggableId={role.id} index={index}>
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
                      <TableCell>
                        <Tooltip title="Drag row to reorder">
                          <SvgIcon path={mdiDrag} />
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <EditRole role={role} onUpdateRole={onUpdateRole}>
                          <>{getLegalFullName(role)}</>
                        </EditRole>
                      </TableCell>
                      <TableCell>{role.role}</TableCell>
                      <TableCell>{role.email}</TableCell>
                      <TableCell>{role.phone_number}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => onDeleteRole(role)}>
                          <SvgIcon path={mdiTrashCanOutline} />
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

      {(checklist.roles?.length ?? 0) === 0 && (
        <Box textAlign="center" my={4}>
          <Typography variant="body2" color="textSecondary">
            Add contacts you'd like to have automatically included in any deal,
            created with this checklist inside it - such as Sales Managers or
            Admins.
          </Typography>
        </Box>
      )}
    </DragDropContext>
  )
}
