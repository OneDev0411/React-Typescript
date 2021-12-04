import { Box } from '@material-ui/core'

import SuperCampaignCloseButton from './SuperCampaignCloseButton'
import SuperCampaignSchedule, {
  SuperCampaignScheduleProps
} from './SuperCampaignSchedule'

interface SuperCampaignDetailHeaderProps
  extends Pick<SuperCampaignScheduleProps, 'setSuperCampaign'> {
  superCampaign: Nullable<ISuperCampaign<'template_instance'>>
}

function SuperCampaignDetailHeader({
  superCampaign,
  setSuperCampaign
}: SuperCampaignDetailHeaderProps) {
  return (
    <Box display="flex" alignItems="center">
      {superCampaign && (
        <SuperCampaignSchedule
          superCampaign={superCampaign}
          setSuperCampaign={setSuperCampaign}
        />
      )}
      <SuperCampaignCloseButton />
    </Box>
  )
}

export default SuperCampaignDetailHeader
