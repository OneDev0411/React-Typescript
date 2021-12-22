import { ReactNode } from 'react'

import { Chip, makeStyles } from '@material-ui/core'

import { ClassesProps } from '@app/utils/ts-utils'

const useStyles = makeStyles(
  theme => ({
    tag: {
      backgroundColor: theme.palette.common.white,
      marginRight: theme.spacing(0.5)
    }
  }),
  { name: 'SuperCampaignDisplayTags' }
)

type DefaultRenderFunc = (item: ReactNode) => ReactNode

interface SuperCampaignDisplayTagsProps extends ClassesProps<typeof useStyles> {
  tags: string[]
  visibleCount: number
  renderNoTags?: DefaultRenderFunc
  renderTags?: DefaultRenderFunc
  renderMore?: DefaultRenderFunc
}

const DEFAULT_RENDER_FUNC: DefaultRenderFunc = item => item

function SuperCampaignDisplayTags({
  tags,
  visibleCount,
  renderNoTags = DEFAULT_RENDER_FUNC,
  renderTags = DEFAULT_RENDER_FUNC,
  renderMore = DEFAULT_RENDER_FUNC,
  classes: classesProp
}: SuperCampaignDisplayTagsProps) {
  const classes = useStyles({ classes: classesProp })

  const moreCount = tags.length - visibleCount

  if (!tags.length) {
    return <>{renderNoTags('No Tags')}</>
  }

  return (
    <>
      {renderTags(
        tags
          .slice(0, visibleCount)
          .map(tag => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              variant="outlined"
              className={classes.tag}
            />
          ))
      )}
      {moreCount > 0 && renderMore(`+${moreCount} More`)}
    </>
  )
}

export default SuperCampaignDisplayTags
