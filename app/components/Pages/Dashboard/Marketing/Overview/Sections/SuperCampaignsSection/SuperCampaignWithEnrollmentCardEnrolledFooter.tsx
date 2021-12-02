import { makeStyles, Typography } from '@material-ui/core'
import { mdiCheck } from '@mdi/js'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import SuperCampaignWithEnrollmentCardTags from './SuperCampaignWithEnrollmentCardTags'

const useStyles = makeStyles(
  theme => ({
    root: {
      padding: theme.spacing(0, 2),
      backgroundColor: theme.palette.info.ultralight,
      minHeight: theme.spacing(9),
      position: 'relative'
    },
    tick: {
      color: theme.palette.info.main,
      marginRight: theme.spacing(0.5)
    },
    header: {
      color: theme.palette.info.dark,
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(1, 0)
    },
    footer: { display: 'flex' }
  }),
  { name: 'SuperCampaignWithEnrollmentCardEnrolledFooter' }
)

interface SuperCampaignWithEnrollmentCardEnrolledFooterProps {
  superCampaignTags: string[]
}

function SuperCampaignWithEnrollmentCardEnrolledFooter({
  superCampaignTags
}: SuperCampaignWithEnrollmentCardEnrolledFooterProps) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <SvgIcon
          className={classes.tick}
          path={mdiCheck}
          size={muiIconSizes.small}
        />
        <Typography variant="caption">You joined with these tags</Typography>
      </div>
      <div className={classes.footer}>
        <SuperCampaignWithEnrollmentCardTags tags={superCampaignTags} />
      </div>
    </div>
  )
}

export default SuperCampaignWithEnrollmentCardEnrolledFooter
