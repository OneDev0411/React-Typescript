import { useContext } from 'react'

import {
  Box,
  IconButton,
  makeStyles,
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

import { useDictionary } from '@app/hooks/use-dictionary'
import { reorder } from '@app/utils/dnd-reorder'
import { SvgIcon } from '@app/views/components/SvgIcons'
import ConfirmationModalContext from 'components/ConfirmationModal/context'

import { useTableStyles } from '../../../../../styles/table.style'
import { getLegalFullName } from '../../Deals/utils/roles'

import { EditRole } from './EditRole'

const useStyles = makeStyles(
  theme => ({
    box: {
      background: theme.palette.grey['50'],
      textAlign: 'center',
      padding: theme.spacing(3)
    }
  }),
  { name: 'ChecklistRoles' }
)

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
  const classes = useStyles()

  const [isRemoving, setRemoving] = useDictionary<boolean>()

  const tableClasses = useTableStyles()
  const confirmationModal = useContext(ConfirmationModalContext)

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
                        <IconButton
                          disabled={isRemoving(role.id)}
                          onClick={() => {
                            confirmationModal.setConfirmationModal({
                              message: 'Remove Role?',
                              description: `Are you sure you want to remove ${
                                role ? getLegalFullName(role) : 'this role'
                              }?`,
                              confirmLabel: 'Yes, Remove it',
                              onConfirm: async () => {
                                setRemoving(role.id, true)
                                await onDeleteRole(role.id)
                                setRemoving(role.id, false)
                              }
                            })
                          }}
                        >
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
        <Box className={classes.box}>
          <Typography variant="body1" color="textPrimary">
            Add contacts you'd like to have automatically included in any deal,
            created with this checklist inside it - such as Sales Managers or
            Admins.
          </Typography>
        </Box>
      )}
    </DragDropContext>
  )
}
