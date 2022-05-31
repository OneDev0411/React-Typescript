import { ReactNode } from 'react'

import { Form } from 'react-final-form'

import { FormTextField } from '@app/views/components/final-form-fields'

import { instagramAccountValidator } from '../SocialDrawer/helpers'

import { captionFieldValidator } from './helpers'
import InstagramAccountAutocompleteField from './InstagramAccountAutocompleteField'

export interface FormValues {
  facebookPage: Nullable<IFacebookPage>
  caption: string
  dueAt: Nullable<Date>
}

export interface SocialPostFormProps {
  className?: string
  formId: string
  onSubmit: (values: FormValues) => Promise<void | Record<string, string>>
  children?: ReactNode
  initialValues?: FormValues
}

function SocialPostForm({
  className,
  formId,
  onSubmit,
  children,
  initialValues = {
    facebookPage: null,
    caption: '',
    dueAt: null
  }
}: SocialPostFormProps) {
  return (
    <Form<FormValues>
      onSubmit={onSubmit}
      initialValues={initialValues}
      render={({ handleSubmit }) => (
        <>
          <form className={className} onSubmit={handleSubmit} id={formId}>
            <InstagramAccountAutocompleteField
              name="facebookPage"
              validate={instagramAccountValidator}
            />
            <FormTextField
              name="caption"
              multiline
              label="Post Caption"
              margin="normal"
              size="small"
              minRows={4}
              validate={captionFieldValidator}
            />
          </form>
          {children}
        </>
      )}
    />
  )
}

export default SocialPostForm
