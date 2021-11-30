import { makeStyles } from '@material-ui/core'
import { mdiClose } from '@mdi/js'

import { useQueryParam } from '@app/hooks/use-query-param'
import LinkIconButton from '@app/views/components/LinkIconButton'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

const useStyles = makeStyles(
  theme => ({
    close: { marginLeft: theme.spacing(0.5) }
  }),
  { name: 'SuperCampaignCloseButton' }
)

function SuperCampaignCloseButton() {
  const classes = useStyles()
  const [backUrl] = useQueryParam('backUrl')

  return (
    <LinkIconButton
      className={classes.close}
      to={backUrl || '/dashboard/insights/super-campaign'}
    >
      <SvgIcon path={mdiClose} />
    </LinkIconButton>
  )
}

export default SuperCampaignCloseButton
