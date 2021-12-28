import { makeStyles } from '@material-ui/core'
import { mdiClose } from '@mdi/js'

import LinkIconButton from '@app/views/components/LinkIconButton'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { useGetSuperCampaignBackUrl } from './use-get-super-campaign-back-url'

const useStyles = makeStyles(
  theme => ({
    close: { marginLeft: theme.spacing(0.5) }
  }),
  { name: 'SuperCampaignCloseButton' }
)

function SuperCampaignCloseButton() {
  const classes = useStyles()
  const backUrl = useGetSuperCampaignBackUrl()

  return (
    <LinkIconButton className={classes.close} to={backUrl}>
      <SvgIcon path={mdiClose} />
    </LinkIconButton>
  )
}

export default SuperCampaignCloseButton
