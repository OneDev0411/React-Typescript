import { FormProps } from 'react-final-form'

import {
  selectAgentMutator,
  selectContactMutator,
  selectUserAgentMutator,
  selectUserMutator
} from './helpers'
import ShowingRoleFormFields, {
  ShowingRoleFormFieldsProps
} from './ShowingRoleFormFields'
import { ShowingRoleFormValues } from './types'

export interface UseShowingRoleFormProps
  extends Pick<
    ShowingRoleFormFieldsProps,
    'hasNotificationTypeFields' | 'initialValues'
  > {
  hideAddToContactCheckbox?: boolean
}

type UseShowingRoleFormReturn = Pick<
  FormProps<ShowingRoleFormValues>,
  'initialValues' | 'mutators' | 'noValidate' | 'children'
>

const mutators: FormProps<ShowingRoleFormValues>['mutators'] = {
  selectUser: selectUserMutator,
  selectAgent: selectAgentMutator,
  selectContact: selectContactMutator,
  selectUserAgent: selectUserAgentMutator
}

function useShowingRoleForm({
  hasNotificationTypeFields,
  initialValues,
  hideAddToContactCheckbox = false
}: UseShowingRoleFormProps): UseShowingRoleFormReturn {
  return {
    initialValues,
    mutators,
    noValidate: true,
    children: ({ form, values }) => (
      <ShowingRoleFormFields
        form={form}
        initialValues={initialValues}
        hasNotificationTypeFields={hasNotificationTypeFields}
        hasSaveToContactCheckbox={
          values.role === 'Tenant' &&
          (!hideAddToContactCheckbox || !!values.contact)
        }
        agents={values.user?.agents ?? undefined}
        saveToContactCheckboxLabel={
          values.contact ? 'Update the contact' : 'Add to my contact'
        }
      />
    )
  }
}

export default useShowingRoleForm
