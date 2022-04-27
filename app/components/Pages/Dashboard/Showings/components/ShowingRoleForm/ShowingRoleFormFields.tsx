import { Box } from '@material-ui/core'
import { FormProps, FormRenderProps, Field } from 'react-final-form'

import { requiredTextValidator } from '@app/utils/validations'
import CustomField from '@app/views/components/DealRole/components/CustomField'
import { MlsSelect } from '@app/views/components/DealRole/Form/form-fields/MlsSelect'
import {
  FormPhoneField,
  FormTextField,
  FormCheckbox
} from 'components/final-form-fields'

import ShowingRoleFormCheckboxGroupField from './ShowingRoleFormCheckboxGroupField'
import ShowingRoleFormNameField from './ShowingRoleFormNameField'
import ShowingRoleYesNoRadioGroupField from './ShowingRoleYesNoRadioGroupField'
import { ShowingRoleFormValues } from './types'

export interface ShowingRoleFormFieldsProps
  extends Pick<FormProps<ShowingRoleFormValues>, 'initialValues'>,
    Pick<FormRenderProps<ShowingRoleFormValues>, 'form'> {
  hasNotificationTypeFields: boolean
  hasSaveToContactCheckbox: boolean
  saveToContactCheckboxLabel: string
  agents: Optional<IAgent[]>
}

function ShowingRoleFormFields({
  form,
  initialValues,
  hasNotificationTypeFields,
  hasSaveToContactCheckbox,
  saveToContactCheckboxLabel,
  agents
}: ShowingRoleFormFieldsProps) {
  return (
    <>
      <FormTextField name="role" hidden />
      <Box display="flex">
        <ShowingRoleFormNameField
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
        <ShowingRoleFormNameField
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
      {agents && agents.length > 1 && (
        <CustomField
          isRequired
          name="agent"
          label="Agent"
          fieldToSelect="id"
          agents={agents}
          component={MlsSelect}
          mutators={{ populateRole: form.mutators.selectUserAgent }}
        />
      )}
      {agents && agents.length === 1 && (
        <Field
          type="hidden"
          component="input"
          name="agent"
          value={agents[0].id}
        />
      )}
      {hasNotificationTypeFields && (
        <>
          <ShowingRoleYesNoRadioGroupField
            name="can_approve"
            label="Can Approve"
          />
          <ShowingRoleFormCheckboxGroupField
            name="confirm_notification_type"
            label="Notify on new bookings and reschedules"
          />
          <ShowingRoleFormCheckboxGroupField
            name="cancel_notification_type"
            label="Notify on confirmations and cancelations"
          />
        </>
      )}
      {hasSaveToContactCheckbox && (
        <FormCheckbox
          name="save_to_contact"
          label={saveToContactCheckboxLabel}
        />
      )}
    </>
  )
}

export default ShowingRoleFormFields
