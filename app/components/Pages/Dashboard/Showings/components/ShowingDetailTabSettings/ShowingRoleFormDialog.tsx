import { Box } from '@material-ui/core'

import {
  FormCheckbox,
  FormPhoneField,
  FormTextField
} from 'components/final-form-fields'

import FormDialog, { FormDialogProps } from '../FormDialog'
// TODO: put the below validator in a better place
import { requiredTextValidator } from '../ShowingStepRolePerson/helpers'
import {
  selectAgentMutator,
  selectContactMutator,
  selectUserMutator
} from './helpers'
import ShowingRoleFormDialogCheckboxGroupField from './ShowingRoleFormDialogCheckboxGroupField'
import ShowingRoleFormDialogNameField from './ShowingRoleFormDialogNameField'
import { ShowingRoleFormValues } from './types'

const mutators: FormDialogProps<ShowingRoleFormValues>['mutators'] = {
  selectUser: selectUserMutator,
  selectAgent: selectAgentMutator,
  selectContact: selectContactMutator
}

export interface ShowingRoleFormDialogProps
  extends Omit<
    FormDialogProps<ShowingRoleFormValues>,
    'children' | 'confirmLabel'
  > {
  hasNotificationTypeFields: boolean
}

function ShowingRoleFormDialog({
  initialValues,
  hasNotificationTypeFields,
  ...otherProps
}: ShowingRoleFormDialogProps) {
  return (
    <FormDialog<ShowingRoleFormValues>
      {...otherProps}
      confirmLabel="Save"
      initialValues={initialValues}
      mutators={mutators}
      noValidate
    >
      {({ form }) => (
        <>
          <FormTextField name="role" hidden />
          <Box display="flex">
            <ShowingRoleFormDialogNameField
              name="first_name"
              label="First Name"
              roleValue={initialValues?.role}
              selectUserMutator={form.mutators.selectUser}
              selectAgentMutator={form.mutators.selectAgent}
              selectContactMutator={form.mutators.selectContact}
              searchFieldValue="first_name"
              validate={requiredTextValidator}
              required
            />
            <Box flexBasis="16px" flexShrink="0" />
            <ShowingRoleFormDialogNameField
              name="last_name"
              label="Last Name"
              roleValue={initialValues?.role}
              selectUserMutator={form.mutators.selectUser}
              selectAgentMutator={form.mutators.selectAgent}
              selectContactMutator={form.mutators.selectContact}
              searchFieldValue="last_name"
              validate={requiredTextValidator}
              required
            />
          </Box>
          <FormTextField
            name="email"
            required
            label="Email"
            type="email"
            validate={requiredTextValidator}
          />
          <FormPhoneField
            name="phone_number"
            required
            label="Phone"
            format={false}
            validate={requiredTextValidator}
          />
          {hasNotificationTypeFields && (
            <>
              <FormCheckbox name="can_approve" label="Can Approve" />
              <ShowingRoleFormDialogCheckboxGroupField
                name="confirm_notification_type"
                label="Confirm Via"
              />
              <ShowingRoleFormDialogCheckboxGroupField
                name="cancel_notification_type"
                label="Notify On Confirmed/Canceled"
              />
            </>
          )}
        </>
      )}
    </FormDialog>
  )
}

export default ShowingRoleFormDialog
