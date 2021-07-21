import { FormProps } from 'react-final-form'

import {
  selectAgentMutator,
  selectContactMutator,
  selectUserMutator
} from './helpers'
import ShowingRoleFormFields, {
  ShowingRoleFormFieldsProps
} from './ShowingRoleFormFields'
import { ShowingRoleFormValues } from './types'

export type UseShowingRoleFormProps = Pick<
  ShowingRoleFormFieldsProps,
  'hasNotificationTypeFields' | 'initialValues'
>

type UseShowingRoleFormReturn = Pick<
  FormProps<ShowingRoleFormValues>,
  'initialValues' | 'mutators' | 'noValidate' | 'children'
>

const mutators: FormProps<ShowingRoleFormValues>['mutators'] = {
  selectUser: selectUserMutator,
  selectAgent: selectAgentMutator,
  selectContact: selectContactMutator
}

function useShowingRoleForm({
  hasNotificationTypeFields,
  initialValues
}: UseShowingRoleFormProps): UseShowingRoleFormReturn {
  return {
    initialValues,
    mutators,
    noValidate: true,
    children: ({ form }) => (
      <ShowingRoleFormFields
        form={form}
        initialValues={initialValues}
        hasNotificationTypeFields={hasNotificationTypeFields}
      />
    )
  }
}

export default useShowingRoleForm
