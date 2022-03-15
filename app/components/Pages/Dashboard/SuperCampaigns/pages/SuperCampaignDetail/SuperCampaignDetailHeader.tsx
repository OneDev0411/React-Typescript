import { makeStyles } from '@material-ui/core'

import { goTo } from '@app/utils/go-to'

import SuperCampaignAdminMoreActions from '../../components/SuperCampaignAdminMoreActions'

import SuperCampaignCloseButton from './SuperCampaignCloseButton'
import SuperCampaignDetailHeaderSchedule from './SuperCampaignDetailHeaderSchedule'
import { useGetSuperCampaignBackUrl } from './use-get-super-campaign-back-url'

const useStyles = makeStyles(
  theme => ({
    root: {
      display: 'flex',
      alignItems: 'center'
    },
    margin: { marginLeft: theme.spacing(1) }
  }),
  { name: 'SuperCampaignDetailHeader' }
)

interface SuperCampaignDetailHeaderProps {
  superCampaign: Optional<ISuperCampaign<'template_instance'>>
}

function SuperCampaignDetailHeader({
  superCampaign
}: SuperCampaignDetailHeaderProps) {
  const classes = useStyles()
  const backUrl = useGetSuperCampaignBackUrl()

  const handleDelete = () => goTo(backUrl)

  const handleDuplicate = (
    newSuperCampaign: ISuperCampaign<'template_instance'>
  ) => {
    goTo(`/dashboard/insights/super-campaign/${newSuperCampaign.id}/detail`)
  }

  return (
    <div className={classes.root}>
      {superCampaign && (
        <>
          <SuperCampaignDetailHeaderSchedule
            className={classes.margin}
            superCampaign={superCampaign}
          />
          <SuperCampaignAdminMoreActions
            className={classes.margin}
            superCampaign={superCampaign}
            onDeleteSuccess={handleDelete}
            onDuplicateSuccess={handleDuplicate}
          />
        </>
      )}
      <SuperCampaignCloseButton />
    </div>
  )
}

export default SuperCampaignDetailHeader
