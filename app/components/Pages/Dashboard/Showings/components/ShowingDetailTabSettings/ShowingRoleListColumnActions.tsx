import { useState } from 'react'
import { Button, IconButton } from '@material-ui/core'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'

import { isEqual } from 'lodash'

import ShowingRoleFormDialog, {
  ShowingRoleFormDialogProps,
  ShowingRoleFormValues
} from './ShowingRoleFormDialog'

export interface ShowingRoleListColumnActionsProps
  extends Pick<ShowingRoleFormDialogProps, 'hideRoles'> {
  isHipPocket: boolean
  role: IShowingRole
  onEdit: (role: IShowingRole) => void
}

function ShowingRoleListColumnActions({
  isHipPocket,
  role,
  hideRoles,
  onEdit
}: ShowingRoleListColumnActionsProps) {
  const hasEdit = role.role !== 'SellerAgent' || isHipPocket
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

  return (
    <>
      {hasEdit && (
        <>
          <Button
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
          />
        </>
      )}
      {hasDelete && (
        <IconButton size="small">
          <DeleteOutlineIcon />
        </IconButton>
      )}
    </>
  )
}

export default ShowingRoleListColumnActions
