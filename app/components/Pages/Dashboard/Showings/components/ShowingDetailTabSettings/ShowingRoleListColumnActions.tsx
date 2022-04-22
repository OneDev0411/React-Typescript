import { useState } from 'react'

import { Button, IconButton, makeStyles, Tooltip } from '@material-ui/core'
import { mdiTrashCanOutline } from '@mdi/js'

import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'
import useAsync from 'hooks/use-async'
import useNotify from 'hooks/use-notify'
import deleteShowingRole from 'models/showing/delete-showing-role'
import updateShowingRole from 'models/showing/update-showing-role'

import { goAndShowNotificationTypes } from '../../constants'
import { getShowingRoleLabel } from '../../helpers'
import {
  ShowingRoleFormDialog,
  ShowingRoleFormDialogProps
} from '../ShowingRoleForm'
import { ShowingRoleFormValues } from '../ShowingRoleForm/types'
import useShowingRoleFormSubmit from '../ShowingRoleForm/use-showing-role-form-submit'

const useStyles = makeStyles(
  theme => ({
    root: { paddingRight: theme.spacing(1) },
    edit: { marginRight: theme.spacing(1) }
  }),
  { name: 'ShowingRoleListColumnActions' }
)

export interface ShowingRoleListColumnActionsProps
  extends Pick<ShowingRoleFormDialogProps, 'hasNotificationTypeFields'> {
  role: IShowingRole
  showingId: UUID
  onEdit: (role: IShowingRole) => void
  onDelete: (roleId: UUID) => void
}

function ShowingRoleListColumnActions({
  role,
  onEdit,
  onDelete,
  showingId,
  hasNotificationTypeFields
}: ShowingRoleListColumnActionsProps) {
  const classes = useStyles()
  const hasDelete = role.role !== 'SellerAgent'

  const [isEditOpen, setIsEditOpen] = useState(false)

  const openEditDialog = () => setIsEditOpen(true)

  const closeEditDialog = () => setIsEditOpen(false)

  const { run, isLoading } = useAsync()

  const notify = useNotify()

  const { handleSubmit: handleEdit, isSavingContact } =
    useShowingRoleFormSubmit((updatedRole: ShowingRoleFormValues) => {
      const roleInput: IShowingRoleInputAPI = {
        role: updatedRole.role,
        first_name: updatedRole.first_name,
        last_name: updatedRole.last_name,
        email: updatedRole.email,
        phone_number: updatedRole.phone_number,
        can_approve: updatedRole.can_approve,
        confirm_notification_type: updatedRole.confirm_notification_type,
        cancel_notification_type: updatedRole.cancel_notification_type,
        user: updatedRole.user?.id,
        agent: updatedRole.agent?.id,
        brand: role.brand,
        ...(!hasNotificationTypeFields ? goAndShowNotificationTypes : {})
      }

      run(async () => {
        const updatedShowing: IShowing = await updateShowingRole(
          showingId,
          role.id,
          roleInput
        )

        const sellerAgent: Optional<IShowingRole> = updatedShowing.roles.find(
          user => user.role === updatedRole.role
        )

        onEdit({
          ...role,
          ...sellerAgent,
          user: sellerAgent?.user ?? role.user
        })
        notify({
          status: 'success',
          message: 'The participant information was updated successfully.'
        })
      })
    })

  const handleDelete = () => {
    run(async () => {
      await deleteShowingRole(showingId, role.id)
      onDelete(role.id)
      notify({
        status: 'success',
        message: 'The participant was deleted successfully.'
      })
    })
  }

  const deleteButton = (
    <IconButton
      size="small"
      disabled={!hasDelete || isLoading || isSavingContact}
      onClick={handleDelete}
    >
      <SvgIcon path={mdiTrashCanOutline} />
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
        disabled={isLoading || isSavingContact}
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
          user: role.user,
          agent: role.agent,
          save_to_contact: true
        }}
        onConfirm={handleEdit}
        hasNotificationTypeFields={hasNotificationTypeFields}
        hideAddToContactCheckbox
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
