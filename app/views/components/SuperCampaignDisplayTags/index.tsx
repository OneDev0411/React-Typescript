import { ReactNode } from 'react'

import { Chip, ChipProps, makeStyles } from '@material-ui/core'
import classNames from 'classnames'

import iff from '@app/utils/iff'
import { ClassesProps } from '@app/utils/ts-utils'

const useStyles = makeStyles(
  theme => ({
    tag: { marginRight: theme.spacing(0.5) },
    outlined: { backgroundColor: theme.palette.common.white }
  }),
  { name: 'SuperCampaignDisplayTags' }
)

type DefaultRenderFunc = (item: ReactNode) => ReactNode

interface SuperCampaignDisplayTagsProps extends ClassesProps<typeof useStyles> {
  tags: string[]
  visibleCount?: number
  renderNoTags?: DefaultRenderFunc
  renderTags?: DefaultRenderFunc
  renderMore?: DefaultRenderFunc
  chipVariant?: ChipProps['variant']
}

const DEFAULT_RENDER_FUNC: DefaultRenderFunc = item => item

function SuperCampaignDisplayTags({
  tags,
  visibleCount = Number.POSITIVE_INFINITY, // Display all tags by default
  renderNoTags = DEFAULT_RENDER_FUNC,
  renderTags = DEFAULT_RENDER_FUNC,
  renderMore = DEFAULT_RENDER_FUNC,
  chipVariant = 'outlined',
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
              variant={chipVariant}
              className={classNames(
                classes.tag,
                iff(chipVariant === 'outlined', classes.outlined)
              )}
            />
          ))
      )}
      {moreCount > 0 && renderMore(`+${moreCount} More`)}
    </>
  )
}

export default SuperCampaignDisplayTags
