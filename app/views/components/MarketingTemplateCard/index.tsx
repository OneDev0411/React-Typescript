import React, { memo, useRef } from 'react'

import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'
import { useSelector } from 'react-redux'

import { selectUser } from 'selectors/user'
import { itemDateText } from 'utils/marketing-center/helpers'
import { ClassesProps } from 'utils/ts-utils'

import { isPlaying } from '../VideoThumbnail'

import { marketingTemplateCardStyles } from './styles'
import { Thumbnail } from './Thumbnail'

interface Props {
  template: IMarketingTemplateInstance | IBrandMarketingTemplate
  handlePreview?: () => void
  isLoading?: boolean
  suffix?: React.ReactNode // overrides default suffix
  actions?: React.ReactNode
}

const useStyles = makeStyles(marketingTemplateCardStyles, {
  name: 'MarketingTemplateCard'
})

function MarketingTemplateCard(
  props: Props & ClassesProps<typeof marketingTemplateCardStyles>
) {
  const { template } = props
  const classes = useStyles({ classes: props.classes })
  const user = useSelector(selectUser)
  const videoThumbRef = useRef<HTMLVideoElement>(null)
  const isInstance = template.type === 'template_instance'

  const handlePreview = e => {
    if (
      !template.template.video &&
      props.handlePreview &&
      e.target.dataset.card === 'true'
    ) {
      props.handlePreview()
    }
  }

  const handleMouseEnter = () => {
    const video = videoThumbRef.current

    if (video) {
      if (isPlaying(video)) {
        return
      }

      video.play()
    }
  }

  const handleMouseOut = () => {
    const video = videoThumbRef.current

    if (video) {
      if (!isPlaying(video)) {
        return
      }

      video.currentTime = 0
      video.pause()
    }
  }

  return (
    <div
      key={template.id}
      title={template.template.name}
      className={classNames(classes.root, {
        [classes.rootHasSuffix]: isInstance
      })}
      onMouseOut={handleMouseOut}
      onMouseEnter={handleMouseEnter}
      onBlur={handleMouseOut}
      onFocus={handleMouseEnter}
    >
      <div
        className={classNames(classes.card, {
          [classes.cardHasPreview]:
            !template.template.video && !!props.handlePreview,
          [classes.cardLoading]: props.isLoading,
          [classes.cardWebsite]: props.template.template.medium === 'Website'
        })}
        onClick={handlePreview}
        data-card="true"
        data-test="marketing-template"
      >
        <Thumbnail
          videoRef={videoThumbRef}
          useStaticImage
          template={template}
          user={user}
        />
        <div className={classes.actions}>{props.actions}</div>
      </div>
      {isInstance && (
        <div className={classes.suffix}>
          {props.suffix || (
            <>
              <div className={classes.suffixCaption}>CREATED AT</div>
              {itemDateText(template.created_at)}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export { MarketingTemplateCardSkeleton } from './MarketingTemplateCardSkeleton'

export default memo(MarketingTemplateCard)
