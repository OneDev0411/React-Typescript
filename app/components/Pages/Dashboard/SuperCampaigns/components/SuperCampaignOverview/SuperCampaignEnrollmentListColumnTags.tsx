import { Tooltip, makeStyles } from '@material-ui/core'

import { useUpdateSuperCampaignEnrollmentTags } from '@app/models/super-campaign'
import SuperCampaignDisplayTags from '@app/views/components/SuperCampaignDisplayTags'
import SuperCampaignTagsPopover from '@app/views/components/SuperCampaignTagsPopover'

import { isSuperCampaignEnrollmentOptedOut } from './helpers'

const useStyles = makeStyles(
  {
    action: { cursor: 'pointer' }
  },
  { name: 'SuperCampaignEnrollmentListColumnTags' }
)

interface SuperCampaignEnrollmentListColumnTagsProps {
  superCampaignEnrollment: ISuperCampaignEnrollment<'user' | 'brand'>
}

function SuperCampaignEnrollmentListColumnTags({
  superCampaignEnrollment
}: SuperCampaignEnrollmentListColumnTagsProps) {
  const classes = useStyles()

  const isOptedOut = isSuperCampaignEnrollmentOptedOut(superCampaignEnrollment)

  const { mutateAsync } = useUpdateSuperCampaignEnrollmentTags()

  if (isOptedOut) {
    return null
  }

  return (
    <SuperCampaignTagsPopover
      tags={superCampaignEnrollment.tags}
      onTagsChange={async tags => {
        await mutateAsync({
          superCampaignId: superCampaignEnrollment.super_campaign,
          enrollment: {
            user: superCampaignEnrollment.user.id,
            brand: superCampaignEnrollment.brand.id,
            tags
          }
        })
      }}
      anchorRenderer={onClick => (
        <Tooltip title="Click to edit">
          <span onClick={onClick} className={classes.action}>
            <SuperCampaignDisplayTags
              tags={superCampaignEnrollment.tags}
              visibleCount={3}
              classes={{ tag: classes.action }}
            />
          </span>
        </Tooltip>
      )}
    />
  )
}

export default SuperCampaignEnrollmentListColumnTags
