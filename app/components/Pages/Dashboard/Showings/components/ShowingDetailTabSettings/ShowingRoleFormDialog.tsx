import { Box } from '@material-ui/core'

import {
  FormPhoneField,
  FormSelect,
  FormSelectProps,
  FormTextField
} from 'components/final-form-fields'
import { SelectItem } from 'components/Select'

import FormDialog, { FormDialogProps } from '../FormDialog'
import ShowingRoleFormDialogCheckboxGroupField from './ShowingRoleFormDialogCheckboxGroupField'

export type ShowingRoleFormValues = Pick<
  IShowingRole,
  | 'role'
  | 'first_name'
  | 'last_name'
  | 'email'
  | 'phone_number'
  | 'confirm_notification_type'
  | 'cancel_notification_type'
>

export interface ShowingRoleFormDialogProps
  extends Omit<
    FormDialogProps<ShowingRoleFormValues>,
    'children' | 'confirmLabel'
  > {
  hideRoles: IShowingRoleType[]
  hasRoleField: boolean
}

function ShowingRoleFormDialog({
  initialValues,
  hideRoles,
  hasRoleField,
  ...otherProps
}: ShowingRoleFormDialogProps) {
  const roleTypeOptions: FormSelectProps<IShowingRoleType>['options'] = [
    !hideRoles.includes('SellerAgent')
      ? { label: 'Agent', value: 'SellerAgent' }
      : false,
    !hideRoles.includes('CoSellerAgent')
      ? { label: 'Co-Agent', value: 'CoSellerAgent' }
      : false,
    !hideRoles.includes('Tenant')
      ? { label: 'Occupant', value: 'Tenant' }
      : false
  ]

  const firstRoleOption = roleTypeOptions.find(
    roleType => !!roleType
  ) as Optional<SelectItem<IShowingRoleType>>

  return (
    <FormDialog<ShowingRoleFormValues>
      {...otherProps}
      confirmLabel="Save"
      initialValues={initialValues || { role: firstRoleOption?.value }}
    >
      {hasRoleField && (
        <FormSelect<IShowingRoleType>
          name="role"
          options={roleTypeOptions}
          label="Select Role"
        />
      )}
      <Box display="flex">
        <FormTextField name="first_name" required label="First Name" />
        <Box flexBasis="16px" flexShrink="0" />
        <FormTextField name="last_name" required label="Last Name" />
      </Box>
      <FormTextField name="email" required label="Email" type="email" />
      <FormPhoneField name="phone_number" required label="Phone" />
      <ShowingRoleFormDialogCheckboxGroupField
        name="confirm_notification_type"
        label="Confirm Via"
      />
      <ShowingRoleFormDialogCheckboxGroupField
        name="cancel_notification_type"
        label="Notify On Confirmed/Canceled"
      />
    </FormDialog>
  )
}

export default ShowingRoleFormDialog
