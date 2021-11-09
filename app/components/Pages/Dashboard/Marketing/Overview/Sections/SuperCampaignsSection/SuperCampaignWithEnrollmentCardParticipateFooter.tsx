import { makeStyles, Button } from '@material-ui/core'

import SuperCampaignTagsPopover from '@app/views/components/SuperCampaignTagsPopover'

import { useEnrollMeInSuperCampaign } from './use-enroll-me-in-super-campaign'

const useStyles = makeStyles(
  theme => ({
    root: { padding: theme.spacing(2) }
  }),
  { name: 'SuperCampaignWithEnrollmentCardParticipateFooter' }
)

interface SuperCampaignWithEnrollmentCardParticipateFooterProps {
  superCampaignId: UUID
  superCampaignTags: string[]
  onEnroll: (enrollment: ISuperCampaignEnrollment) => void
}

function SuperCampaignWithEnrollmentCardParticipateFooter({
  superCampaignId,
  superCampaignTags,
  onEnroll
}: SuperCampaignWithEnrollmentCardParticipateFooterProps) {
  const classes = useStyles()

  const { enrollMeInSuperCampaign, isEnrolling } = useEnrollMeInSuperCampaign(
    superCampaignId,
    onEnroll
  )

  return (
    <div className={classes.root}>
      <SuperCampaignTagsPopover
        tags={superCampaignTags}
        onTagsChange={enrollMeInSuperCampaign}
        anchorRenderer={onClick => (
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            size="small"
            onClick={onClick}
            disabled={isEnrolling}
          >
            Add Tags to Participate
          </Button>
        )}
        defaultIsDirty
        minimumTag={1}
      />
    </div>
  )
}

export default SuperCampaignWithEnrollmentCardParticipateFooter
