import { makeStyles, Typography, Chip } from '@material-ui/core'
import classNames from 'classnames'

const useStyles = makeStyles(
  theme => ({
    root: {
      display: 'flex',
      whiteSpace: 'nowrap',
      alignItems: 'center'
    },
    tags: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      display: 'inline-flex'
    },
    tag: {
      backgroundColor: theme.palette.common.white,
      marginRight: theme.spacing(0.5),
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
  className: string
  tags: string[]
}

function SuperCampaignWithEnrollmentCardTags({
  className,
  tags
}: SuperCampaignWithEnrollmentCardTagsProps) {
  const classes = useStyles()
  const moreCount = tags.length - 2

  return (
    <div className={classNames(classes.root, className)}>
      <div className={classes.tags}>
        {tags.slice(0, 2).map(tag => (
          <Chip
            key={tag}
            label={tag}
            size="small"
            variant="outlined"
            className={classes.tag}
          />
        ))}
      </div>
      {moreCount > 0 && (
        <Typography className={classes.more} variant="caption">
          +{moreCount}more
        </Typography>
      )}
    </div>
  )
}

export default SuperCampaignWithEnrollmentCardTags
