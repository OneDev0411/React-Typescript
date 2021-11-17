import { Chip, makeStyles, Tooltip } from '@material-ui/core'

import SuperCampaignTagsPopover, {
  SuperCampaignTagsPopoverProps
} from '@app/views/components/SuperCampaignTagsPopover'

const useStyles = makeStyles(
  theme => ({
    tag: { marginRight: theme.spacing(0.5) }
  }),
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

  const visibleTagsCount = 3
  const moreCount = tags.length - visibleTagsCount

  return (
    <SuperCampaignTagsPopover
      {...otherProps}
      tags={tags}
      anchorRenderer={onClick => (
        <Tooltip title="Click to edit">
          <span onClick={onClick}>
            {tags.length > 0 ? (
              <>
                {tags.slice(0, visibleTagsCount).map(tag => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    variant="outlined"
                    className={classes.tag}
                  />
                ))}
                {moreCount > 0 && (
                  <Chip
                    label={`+${moreCount}`}
                    size="small"
                    variant="outlined"
                    className={classes.tag}
                  />
                )}
              </>
            ) : (
              <Chip label="No Tags" size="small" />
            )}
          </span>
        </Tooltip>
      )}
    />
  )
}

export default SuperCampaignEnrollmentListColumnTags
