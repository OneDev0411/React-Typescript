import { makeStyles, Button, Typography } from '@material-ui/core'
import { mdiCheck } from '@mdi/js'

import SuperCampaignTagsPopover from '@app/views/components/SuperCampaignTagsPopover'
import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import SuperCampaignWithEnrollmentCardActions from './SuperCampaignWithEnrollmentCardActions'
import SuperCampaignWithEnrollmentCardTags from './SuperCampaignWithEnrollmentCardTags'
import { useUnenrollMeFromSuperCampaign } from './use-unenroll-me-from-super-campaign'
import { useUpdateMySuperCampaignEnrollment } from './use-update-my-super-campaign-enrollment'

const useStyles = makeStyles(
  theme => ({
    root: {
      padding: theme.spacing(0, 2),
      backgroundColor: theme.palette.info.ultralight,
      minHeight: theme.spacing(8),
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
      padding: theme.spacing(0.5, 0, 1, 0)
    },
    tags: {
      // We need to render the tags and the edit button on a line and avoid the overflow problem.
      // The theme.spacing(6) is required space rendering the edit button
      maxWidth: `calc(100% - ${theme.spacing(6)}px)`
    },
    edit: { minWidth: 0 },
    action: {
      position: 'absolute',
      top: theme.spacing(0.5),
      right: theme.spacing(1.5)
    },
    footer: { display: 'flex' }
  }),
  { name: 'SuperCampaignWithEnrollmentCardEnrolledFooter' }
)

interface SuperCampaignWithEnrollmentCardEnrolledFooterProps {
  superCampaignId: UUID
  superCampaignTags: string[]
  onUpdate: (enrollment: ISuperCampaignEnrollment) => void
  onUnenroll: () => void
}

function SuperCampaignWithEnrollmentCardEnrolledFooter({
  superCampaignId,
  superCampaignTags,
  onUpdate,
  onUnenroll
}: SuperCampaignWithEnrollmentCardEnrolledFooterProps) {
  const classes = useStyles()

  const { updateMySuperCampaignEnrollment, isUpdating } =
    useUpdateMySuperCampaignEnrollment(superCampaignId, onUpdate)

  const { unenrollMeFromSuperCampaign, isDeleting } =
    useUnenrollMeFromSuperCampaign(superCampaignId, onUnenroll)

  return (
    <div className={classes.root}>
      <SuperCampaignWithEnrollmentCardActions
        className={classes.action}
        disabled={isUpdating || isDeleting}
        onOptOutClick={unenrollMeFromSuperCampaign}
      />
      <div className={classes.header}>
        <SvgIcon
          className={classes.tick}
          path={mdiCheck}
          size={muiIconSizes.small}
        />
        <Typography variant="caption">You joined with these tags</Typography>
      </div>
      <div className={classes.footer}>
        <SuperCampaignWithEnrollmentCardTags
          className={classes.tags}
          tags={superCampaignTags}
        />
        .
        <SuperCampaignTagsPopover
          tags={superCampaignTags}
          onTagsChange={updateMySuperCampaignEnrollment}
          anchorRenderer={onClick => (
            <Button
              className={classes.edit}
              onClick={onClick}
              color="primary"
              size="small"
              disabled={isUpdating || isDeleting}
            >
              Edit
            </Button>
          )}
          minTagCount={1}
        />
      </div>
    </div>
  )
}

export default SuperCampaignWithEnrollmentCardEnrolledFooter
