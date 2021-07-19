import FormDialog, { FormDialogProps } from '../FormDialog'
import { ShowingRoleFormValues } from './types'
import useShowingRoleForm from './use-showing-role-form'

export interface ShowingRoleFormDialogProps
  extends Omit<
    FormDialogProps<ShowingRoleFormValues>,
    'children' | 'confirmLabel' | 'noValidate' | 'mutators'
  > {
  hasNotificationTypeFields: boolean
}

function ShowingRoleFormDialog({
  initialValues,
  hasNotificationTypeFields,
  ...otherProps
}: ShowingRoleFormDialogProps) {
  const showingFormProps = useShowingRoleForm({
    hasNotificationTypeFields,
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
