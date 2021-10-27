import { Button } from '@material-ui/core'
import { mdiPlus } from '@mdi/js'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

function SuperCampaignEnrollManuallyButton() {
  // TODO: Implement the add logic
  return (
    <Button
      color="primary"
      startIcon={<SvgIcon path={mdiPlus} size={muiIconSizes.small} />}
      size="small"
      onClick={() => console.log('Not Implemented')}
    >
      Enroll Participants Manually
    </Button>
  )
}

export default SuperCampaignEnrollManuallyButton
