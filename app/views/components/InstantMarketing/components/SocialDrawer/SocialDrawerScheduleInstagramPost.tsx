import { Box } from '@material-ui/core'
import { Form } from 'react-final-form'

import Drawer from '@app/views/components/OverlayDrawer'

import SocialDrawerPreviewFile from './SocialDrawerPreviewFile'
import SocialDrawerScheduleInstagramPostFooter from './SocialDrawerScheduleInstagramPostFooter'
import SocialDrawerScheduleInstagramPostForm from './SocialDrawerScheduleInstagramPostForm'

interface FormValues {
  instagramAccounts: IFacebookPage[]
  caption: string
  dueAt: Nullable<Date>
}

interface SocialDrawerScheduleInstagramPostProps {
  instance: Optional<IMarketingTemplateInstance | IBrandAsset>
  errorMessage: Nullable<string>
}

const formId = 'schedule-instagram-post-form'

function SocialDrawerScheduleInstagramPost({
  instance,
  errorMessage
}: SocialDrawerScheduleInstagramPostProps) {
  const handleSubmit = async (values: FormValues) => {
    // TODO: call the update model
    console.log('values', values)
    await new Promise(resolve => setTimeout(resolve, 2500))
  }

  return (
    <Form<FormValues>
      onSubmit={handleSubmit}
      initialValues={{
        instagramAccounts: [],
        caption: '',
        dueAt: null
      }}
      render={({ handleSubmit }) => (
        <>
          <Drawer.Body>
            <Box my={3}>
              <SocialDrawerPreviewFile
                instance={instance}
                error={errorMessage}
              />
              <Box my={2}>
                <SocialDrawerScheduleInstagramPostForm
                  onSubmit={handleSubmit}
                  formId={formId}
                />
              </Box>
            </Box>
          </Drawer.Body>
          <SocialDrawerScheduleInstagramPostFooter formId={formId} />
        </>
      )}
    />
  )
}

export default SocialDrawerScheduleInstagramPost
