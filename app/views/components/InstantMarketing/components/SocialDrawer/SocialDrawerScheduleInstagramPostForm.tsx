import { Form } from 'react-final-form'

import InstagramAccountsAutocompleteField from './InstagramAccountsAutocompleteField'

function SocialDrawerScheduleInstagramPostForm() {
  return (
    <Form
      onSubmit={values => console.log('Form::onSubmit', values)}
      initialValues={{ instagramAccounts: [] }}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <InstagramAccountsAutocompleteField name="instagramAccounts" />
        </form>
      )}
    />
  )
}

export default SocialDrawerScheduleInstagramPostForm
