import { ReactNode } from 'react'

import { Form } from 'react-final-form'

import { requiredTextValidator } from '@app/utils/validations'
import { FormTextField } from '@app/views/components/final-form-fields'

import { instagramAccountValidator } from '../SocialDrawer/helpers'

import InstagramAccountAutocompleteField from './InstagramAccountAutocompleteField'

export interface FormValues {
  facebookPage: Nullable<IFacebookPage>
  caption: string
  dueAt: Nullable<Date>
}

interface SocialPostFormProps {
  className?: string
  formId: string
  onSubmit: (values: FormValues) => Promise<ISocialPost>
  children?: ReactNode
}

function SocialPostForm({
  className,
  formId,
  onSubmit,
  children
}: SocialPostFormProps) {
  return (
    <Form<FormValues>
      onSubmit={onSubmit}
      initialValues={{
        facebookPage: null,
        caption: '',
        dueAt: null
      }}
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
              validate={requiredTextValidator}
            />
          </form>
          {children}
        </>
      )}
    />
  )
}

export default SocialPostForm
