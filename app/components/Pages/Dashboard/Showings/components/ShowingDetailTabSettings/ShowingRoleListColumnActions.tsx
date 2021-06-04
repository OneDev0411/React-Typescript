import { useState } from 'react'
import { Button, IconButton, makeStyles, Tooltip } from '@material-ui/core'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'

import { isEqual } from 'lodash'

import ShowingRoleFormDialog, {
  ShowingRoleFormDialogProps,
  ShowingRoleFormValues
} from './ShowingRoleFormDialog'

const useStyles = makeStyles(
  theme => ({
    root: { paddingRight: theme.spacing(1) },
    edit: { marginRight: theme.spacing(1) }
  }),
  { name: 'ShowingRoleListColumnActions' }
)

export interface ShowingRoleListColumnActionsProps
  extends Pick<ShowingRoleFormDialogProps, 'hideRoles'> {
  role: IShowingRole
  onEdit: (role: IShowingRole) => void
}

function ShowingRoleListColumnActions({
  role,
  hideRoles,
  onEdit
}: ShowingRoleListColumnActionsProps) {
  const classes = useStyles()
  const hasDelete = role.role !== 'SellerAgent'

  const [isEditOpen, setIsEditOpen] = useState(false)

  const openEditDialog = () => setIsEditOpen(true)

  const closeEditDialog = () => setIsEditOpen(false)

  const handleEdit = (updatedRole: ShowingRoleFormValues) => {
    if (!isEqual(role, updatedRole)) {
      onEdit({
        ...role,
        ...updatedRole
      })
    }
  }

  const deleteButton = (
    <IconButton size="small" disabled={!hasDelete}>
      <DeleteOutlineIcon />
    </IconButton>
  )

  return (
    <div className={classes.root}>
      <Button
        className={classes.edit}
        size="small"
        variant="outlined"
        color="default"
        onClick={openEditDialog}
      >
        Edit
      </Button>
      <ShowingRoleFormDialog
        title="Edit Participant"
        open={isEditOpen}
        onClose={closeEditDialog}
        hideRoles={hideRoles}
        initialValues={role}
        onConfirm={handleEdit}
        hasRoleField={role.role !== 'SellerAgent'}
      />
      {hasDelete ? (
        deleteButton
      ) : (
        <Tooltip title="You can not delete the seller agent role">
          <span>{deleteButton}</span>
        </Tooltip>
      )}
    </div>
  )
}

export default ShowingRoleListColumnActions
