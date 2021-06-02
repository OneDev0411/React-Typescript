import { Box } from '@material-ui/core'

import {
  FormPhoneField,
  FormSelect,
  FormSelectProps,
  FormTextField
} from 'components/final-form-fields'
import { SelectItem } from 'components/Select'

import FormDialog, { FormDialogProps } from '../FormDialog'

export type ShowingRoleFormValues = Pick<
  IShowingRole,
  'role' | 'first_name' | 'last_name' | 'email' | 'phone_number'
>

export interface ShowingRoleFormDialogProps
  extends Omit<
    FormDialogProps<ShowingRoleFormValues>,
    'children' | 'confirmLabel'
  > {
  hideRoles: IShowingRoleType[]
}

function ShowingRoleFormDialog({
  initialValues,
  hideRoles,
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
      <FormSelect<IShowingRoleType>
        name="role"
        options={roleTypeOptions}
        label="Select Role"
      />
      <Box display="flex">
        <FormTextField name="first_name" required label="First Name" />
        <Box flexBasis="16px" flexShrink="0" />
        <FormTextField name="last_name" required label="Last Name" />
      </Box>
      <FormTextField name="email" required label="Email" type="email" />
      <FormPhoneField name="phone_number" required label="Phone" />
    </FormDialog>
  )
}

export default ShowingRoleFormDialog
