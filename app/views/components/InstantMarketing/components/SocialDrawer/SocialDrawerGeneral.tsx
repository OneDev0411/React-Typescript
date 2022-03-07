import { Box } from '@material-ui/core'

import Drawer from '@app/views/components/OverlayDrawer'

import SocialDrawerActions from './SocialDrawerActions'
import SocialDrawerPreviewFile from './SocialDrawerPreviewFile'

interface SocialDrawerGeneralProps {
  instance: Optional<IMarketingTemplateInstance | IBrandAsset>
  errorMessage: Nullable<string>
}

function SocialDrawerGeneral({
  instance,
  errorMessage
}: SocialDrawerGeneralProps) {
  return (
    <Drawer.Body>
      <Box my={3}>
        <SocialDrawerPreviewFile instance={instance} error={errorMessage} />
        {instance && <SocialDrawerActions instance={instance} />}
      </Box>
    </Drawer.Body>
  )
}

export default SocialDrawerGeneral
