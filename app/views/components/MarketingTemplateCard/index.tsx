import React from 'react'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'

import { getTemplateImage, itemDateText } from 'utils/marketing-center/helpers'
import { ClassesProps } from 'utils/ts-utils'
import { IAppState } from 'reducers/index'

import { marketingTemplateCardStyles } from './styles'

interface StateProps {
  user: IUser
}

interface Props {
  template: IMarketingTemplateInstance | IMarketingTemplate
  handlePreview?: () => void
  isLoading?: boolean
  suffix?: React.ReactNode // overrides default suffix
  actions?: React.ReactNode
}

const useStyles = makeStyles(marketingTemplateCardStyles, {
  name: 'MarketingTemplateCard'
})

function MarketingTemplateCard(
  props: Props & StateProps & ClassesProps<typeof marketingTemplateCardStyles>
) {
  const { template } = props
  const classes = useStyles({ classes: props.classes })

  const { thumbnail } = getTemplateImage(template)

  const isInstance = template.type === 'template_instance'

  const handlePreview = e => {
    if (
      !template.video &&
      props.handlePreview &&
      e.target.dataset.card === 'true'
    ) {
      props.handlePreview()
    }
  }

  return (
    <div
      key={template.id}
      title={template.template.name}
      className={classNames(classes.root, {
        [classes.rootHasSuffix]: isInstance
      })}
    >
      <div
        className={classNames(classes.card, {
          [classes.cardHasPreview]: !template.isVideo && props.handlePreview,
          [classes.cardLoading]: props.isLoading
        })}
        onClick={handlePreview}
        data-card="true"
        data-test="marketing-template"
      >
        {template.video ? (
          <video src={thumbnail} muted autoPlay />
        ) : (
          <img
            alt={template.template.name}
            src={thumbnail}
            className={classes.image}
          />
        )}

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

export default connect<StateProps>(({ user }: IAppState) => ({ user }))(
  MarketingTemplateCard
)
