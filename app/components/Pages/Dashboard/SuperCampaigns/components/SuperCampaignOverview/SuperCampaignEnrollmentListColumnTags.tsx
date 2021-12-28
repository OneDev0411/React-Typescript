import { Tooltip, makeStyles } from '@material-ui/core'

import SuperCampaignDisplayTags from '@app/views/components/SuperCampaignDisplayTags'
import SuperCampaignTagsPopover, {
  SuperCampaignTagsPopoverProps
} from '@app/views/components/SuperCampaignTagsPopover'

const useStyles = makeStyles(
  {
    action: { cursor: 'pointer' }
  },
  { name: 'SuperCampaignEnrollmentListColumnTags' }
)

interface SuperCampaignEnrollmentListColumnTagsProps
  extends Pick<SuperCampaignTagsPopoverProps, 'tags' | 'onTagsChange'> {
  isOptedOut: boolean
}

function SuperCampaignEnrollmentListColumnTags({
  isOptedOut,
  tags,
  ...otherProps
}: SuperCampaignEnrollmentListColumnTagsProps) {
  const classes = useStyles()

  if (isOptedOut) {
    return null
  }

  return (
    <SuperCampaignTagsPopover
      {...otherProps}
      tags={tags}
      anchorRenderer={onClick => (
        <Tooltip title="Click to edit">
          <span onClick={onClick} className={classes.action}>
            <SuperCampaignDisplayTags
              tags={tags}
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
