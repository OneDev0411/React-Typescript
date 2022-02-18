import { makeStyles } from '@material-ui/core'

import { goTo } from '@app/utils/go-to'

import SuperCampaignAdminMoreActions from '../../components/SuperCampaignAdminMoreActions'

import SuperCampaignCloseButton from './SuperCampaignCloseButton'
import SuperCampaignDetailHeaderSchedule, {
  SuperCampaignDetailHeaderScheduleProps
} from './SuperCampaignDetailHeaderSchedule'
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

interface SuperCampaignDetailHeaderProps
  extends Pick<SuperCampaignDetailHeaderScheduleProps, 'setSuperCampaign'> {
  superCampaign: Nullable<ISuperCampaign<'template_instance'>>
}

function SuperCampaignDetailHeader({
  superCampaign,
  setSuperCampaign
}: SuperCampaignDetailHeaderProps) {
  const classes = useStyles()
  const backUrl = useGetSuperCampaignBackUrl()

  const handleSendNow = (newSuperCampaign: ISuperCampaign) =>
    setSuperCampaign({
      ...newSuperCampaign,
      template_instance: superCampaign?.template_instance
    })

  const handleDelete = () => goTo(backUrl)

  const handleDuplicate = (newSuperCampaign: ISuperCampaign) => {
    goTo(`/dashboard/insights/super-campaign/${newSuperCampaign.id}/detail`)
  }

  return (
    <div className={classes.root}>
      {superCampaign && (
        <>
          <SuperCampaignDetailHeaderSchedule
            className={classes.margin}
            superCampaign={superCampaign}
            setSuperCampaign={setSuperCampaign}
          />
          <SuperCampaignAdminMoreActions
            className={classes.margin}
            superCampaign={{
              ...superCampaign,
              template_instance: superCampaign.template_instance?.id
            }}
            onSendNow={handleSendNow}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
          />
        </>
      )}
      <SuperCampaignCloseButton />
    </div>
  )
}

export default SuperCampaignDetailHeader
