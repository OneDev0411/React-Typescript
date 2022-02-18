import { makeStyles, Typography, Tooltip } from '@material-ui/core'
import classNames from 'classnames'

import SuperCampaignDisplayTags from '@app/views/components/SuperCampaignDisplayTags'

const useStyles = makeStyles(
  theme => ({
    root: {
      display: 'flex',
      whiteSpace: 'nowrap',
      alignItems: 'center',
      overflow: 'hidden'
    },
    tags: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      display: 'inline-flex'
    },
    tag: {
      overflow: 'hidden',
      minWidth: theme.spacing(6)
    },
    more: {
      flexShrink: 0,
      flexGrow: 0,
      marginRight: theme.spacing(0.5)
    }
  }),
  { name: 'SuperCampaignWithEnrollmentCardTags' }
)

interface SuperCampaignWithEnrollmentCardTagsProps {
  className?: string
  tags: string[]
}

function SuperCampaignWithEnrollmentCardTags({
  className,
  tags
}: SuperCampaignWithEnrollmentCardTagsProps) {
  const classes = useStyles()

  return (
    <div className={classNames(classes.root, className)}>
      <SuperCampaignDisplayTags
        tags={tags}
        visibleCount={2}
        renderTags={tags => <div className={classes.tags}>{tags}</div>}
        renderMore={more => (
          <Tooltip title="Click to view and edit the tags">
            <Typography className={classes.more} variant="caption">
              {more}
            </Typography>
          </Tooltip>
        )}
        renderNoTags={noTags => (
          <Typography variant="caption">{noTags}</Typography>
        )}
        classes={{ tag: classes.tag }}
      />
    </div>
  )
}

export default SuperCampaignWithEnrollmentCardTags
