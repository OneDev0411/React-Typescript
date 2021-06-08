import { useState } from 'react'
import isEqual from 'lodash/isEqual'
import { Button, IconButton, makeStyles, Tooltip } from '@material-ui/core'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'

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
  onEdit: (role: IShowingRole) => void
}

function ShowingRoleListColumnActions({
  role,
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
        title={`Edit ${getShowingRoleLabel(role.role)} Role`}
        open={isEditOpen}
        onClose={closeEditDialog}
        initialValues={role}
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
