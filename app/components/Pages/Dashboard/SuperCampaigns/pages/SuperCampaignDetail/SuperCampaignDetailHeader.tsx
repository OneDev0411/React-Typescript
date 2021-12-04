import { Box } from '@material-ui/core'

import SuperCampaignCloseButton from './SuperCampaignCloseButton'
import SuperCampaignDetailHeaderMoreActions from './SuperCampaignDetailHeaderMoreActions'
import SuperCampaignDetailHeaderSchedule, {
  SuperCampaignDetailHeaderScheduleProps
} from './SuperCampaignDetailHeaderSchedule'

interface SuperCampaignDetailHeaderProps
  extends Pick<SuperCampaignDetailHeaderScheduleProps, 'setSuperCampaign'> {
  superCampaign: Nullable<ISuperCampaign<'template_instance'>>
}

function SuperCampaignDetailHeader({
  superCampaign,
  setSuperCampaign
}: SuperCampaignDetailHeaderProps) {
  return (
    <Box display="flex" alignItems="center">
      {superCampaign && (
        <>
          <SuperCampaignDetailHeaderSchedule
            superCampaign={superCampaign}
            setSuperCampaign={setSuperCampaign}
          />
          <SuperCampaignDetailHeaderMoreActions
            superCampaign={superCampaign}
            setSuperCampaign={setSuperCampaign}
          />
        </>
      )}
      <SuperCampaignCloseButton />
    </Box>
  )
}

export default SuperCampaignDetailHeader
