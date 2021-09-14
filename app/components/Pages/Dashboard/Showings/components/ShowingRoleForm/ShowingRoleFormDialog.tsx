import FormDialog, { FormDialogProps } from '../FormDialog'

import { ShowingRoleFormValues } from './types'
import useShowingRoleForm from './use-showing-role-form'

export interface ShowingRoleFormDialogProps
  extends Omit<
    FormDialogProps<ShowingRoleFormValues>,
    'children' | 'confirmLabel' | 'noValidate' | 'mutators'
  > {
  hasNotificationTypeFields: boolean
  hideAddToContactCheckbox?: boolean
}

function ShowingRoleFormDialog({
  initialValues,
  hasNotificationTypeFields,
  hideAddToContactCheckbox,
  ...otherProps
}: ShowingRoleFormDialogProps) {
  const showingFormProps = useShowingRoleForm({
    hasNotificationTypeFields,
    hideAddToContactCheckbox,
    initialValues
  })

  return (
    <FormDialog<ShowingRoleFormValues>
      {...otherProps}
      {...showingFormProps}
      confirmLabel="Save"
    />
  )
}

export default ShowingRoleFormDialog
