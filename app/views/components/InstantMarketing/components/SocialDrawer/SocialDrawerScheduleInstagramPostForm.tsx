import { FormEventHandler } from 'react'

import { requiredTextValidator } from '@app/utils/validations'
import { FormTextField } from '@app/views/components/final-form-fields'

import { instagramAccountsValidator } from './helpers'
import InstagramAccountsAutocompleteField from './InstagramAccountsAutocompleteField'

interface SocialDrawerScheduleInstagramPostFormProps {
  formId: string
  onSubmit: FormEventHandler
}

function SocialDrawerScheduleInstagramPostForm({
  formId,
  onSubmit
}: SocialDrawerScheduleInstagramPostFormProps) {
  return (
    <form onSubmit={onSubmit} id={formId}>
      <InstagramAccountsAutocompleteField
        name="instagramAccounts"
        validate={instagramAccountsValidator}
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
  )
}

export default SocialDrawerScheduleInstagramPostForm
