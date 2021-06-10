import { useState } from 'react'
import { Button, IconButton, makeStyles, Tooltip } from '@material-ui/core'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'

import useAsync from 'hooks/use-async'

import updateShowingRole from 'models/showing/update-showing-role'

import deleteShowingRole from 'models/showing/delete-showing-role'

import ShowingRoleFormDialog from './ShowingRoleFormDialog'
import { ShowingRoleFormValues } from './types'
import { getShowingRoleLabel } from './helpers'

const useStyles = makeStyles(
  theme => ({
    root: { paddingRight: theme.spacing(1) },
    edit: { marginRight: theme.spacing(1) }
  }),
  { name: 'ShowingRoleListColumnActions' }
)

export interface ShowingRoleListColumnActionsProps {
  role: IShowingRole
  showingId: UUID
  onEdit: (role: IShowingRole) => void
  onDelete: (roleId: UUID) => void
}

function ShowingRoleListColumnActions({
  role,
  onEdit,
  onDelete,
  showingId
}: ShowingRoleListColumnActionsProps) {
  const classes = useStyles()
  const hasDelete = role.role !== 'SellerAgent'

  const [isEditOpen, setIsEditOpen] = useState(false)

  const openEditDialog = () => setIsEditOpen(true)

  const closeEditDialog = () => setIsEditOpen(false)

  const { run, isLoading } = useAsync()

  const handleEdit = (updatedRole: ShowingRoleFormValues) => {
    const roleInput: IShowingRoleInput = {
      role: updatedRole.role,
      first_name: updatedRole.first_name,
      last_name: updatedRole.last_name,
      email: updatedRole.email,
      phone_number: updatedRole.phone_number,
      can_approve: updatedRole.can_approve,
      confirm_notification_type: updatedRole.confirm_notification_type,
      cancel_notification_type: updatedRole.cancel_notification_type,
      user: updatedRole.user,
      brand: role.brand
    }

    run(async () => {
      await updateShowingRole(showingId, role.id, roleInput)
      onEdit({
        ...role,
        ...updatedRole
      })
    })
  }

  const handleDelete = () => {
    run(async () => {
      await deleteShowingRole(showingId, role.id)
      onDelete(role.id)
    })
  }

  const deleteButton = (
    <IconButton
      size="small"
      disabled={!hasDelete || isLoading}
      onClick={handleDelete}
    >
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
        disabled={isLoading}
      >
        Edit
      </Button>
      <ShowingRoleFormDialog
        title={`Edit ${getShowingRoleLabel(role.role)} Role`}
        open={isEditOpen}
        onClose={closeEditDialog}
        initialValues={{
          role: role.role,
          first_name: role.first_name,
          last_name: role.last_name,
          email: role.email,
          phone_number: role.phone_number,
          can_approve: role.can_approve,
          confirm_notification_type: role.confirm_notification_type,
          cancel_notification_type: role.cancel_notification_type,
          user: role.user
        }}
        onConfirm={handleEdit}
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
