import { Box, Button } from '@material-ui/core'

import Drawer from '@app/views/components/OverlayDrawer'

import SocialDrawerPreviewFile from './SocialDrawerPreviewFile'
import { useSetSocialDrawerStep } from './use-set-social-drawer-step'

interface SocialDrawerScheduleInstagramPostProps {
  instance: Optional<IMarketingTemplateInstance | IBrandAsset>
  errorMessage: Nullable<string>
}

function SocialDrawerScheduleInstagramPost({
  instance,
  errorMessage
}: SocialDrawerScheduleInstagramPostProps) {
  const setStep = useSetSocialDrawerStep()

  const gotoGeneralStep = () => setStep('General')

  return (
    <>
      <Drawer.Body>
        <Box my={3}>
          <SocialDrawerPreviewFile instance={instance} error={errorMessage} />
          form fields
        </Box>
      </Drawer.Body>
      <Drawer.Footer>
        <Button onClick={gotoGeneralStep}>Back</Button>
        <Button>Save</Button>
      </Drawer.Footer>
    </>
  )
}

export default SocialDrawerScheduleInstagramPost
