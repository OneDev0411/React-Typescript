import { ReactNode } from 'react'

import { Form, FormProps } from 'react-final-form'

import { ShowingRoleFormValues } from './types'
import useShowingRoleForm from './use-showing-role-form'

export interface ShowingRoleFormProps
  extends Omit<
    FormProps<ShowingRoleFormValues>,
    'children' | 'confirmLabel' | 'noValidate' | 'mutators'
  > {
  hasNotificationTypeFields: boolean
  onSubmit: FormProps<ShowingRoleFormValues>['onSubmit']
  children?: ReactNode
}

function ShowingRoleForm({
  initialValues,
  hasNotificationTypeFields,
  children,
  ...otherProps
}: ShowingRoleFormProps) {
  const {
    children: fields,
    noValidate,
    ...showingFormProps
  } = useShowingRoleForm({
    hasNotificationTypeFields,
    initialValues
  })

  return (
    <Form<ShowingRoleFormValues> {...otherProps} {...showingFormProps}>
      {formProps => (
        <form onSubmit={formProps.handleSubmit} noValidate={noValidate}>
          {typeof fields === 'function' ? fields(formProps) : fields}
          {children}
        </form>
      )}
    </Form>
  )
}

export default ShowingRoleForm
