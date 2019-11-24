import React, { useState } from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'

import { makeStyles } from '@material-ui/core'

import classNames from 'classnames'

import { getBrandByType } from 'utils/user-teams'

import { getTemplateImage, itemDateText } from 'utils/marketing-center/helpers'

import { IAppState } from 'reducers/index'

import { ClassesProps } from 'utils/ts-utils'

import IconButton from '../Button/IconButton'
import ActionButton from '../Button/ActionButton'
import DeleteIcon from '../SvgIcons/DeleteOutline/IconDeleteOutline'
import Tooltip from '../tooltip'
import { marketingTemplateCardStyles } from './styles'

interface Props {
  template: IMarketingTemplateInstance | IMarketingTemplate
  notify: typeof notify
  user: IUser
  handlePreview: (
    template: IMarketingTemplateInstance | IMarketingTemplate
  ) => void
  handleEdit?: (
    template: IMarketingTemplateInstance | IMarketingTemplate
  ) => void
  handleCustomize: (
    template: IMarketingTemplateInstance | IMarketingTemplate
  ) => void
  handleDelete?: (
    template: IMarketingTemplateInstance | IMarketingTemplate
  ) => void
}

const useStyles = makeStyles(marketingTemplateCardStyles, {
  name: 'MarketingTemplateCard'
})

function MarketingTemplateCard(
  props: Props & ClassesProps<typeof marketingTemplateCardStyles>
) {
  const { template } = props
  const [isDeleting, setDeleting] = useState(false)
  const brokerageBrand = getBrandByType(props.user, 'Brokerage')
  const classes = useStyles({ classes: props.classes })

  const { thumbnail } = getTemplateImage(template, brokerageBrand)

  const isInstance = template.type === 'template_instance'
  let handleOnPreview = () => props.handlePreview(template)

  if (template.video) {
    handleOnPreview = () => false
  }

  return (
    <div
      key={template.id}
      className={classNames(classes.root, {
        [classes.rootHasSuffix]: isInstance
      })}
    >
      <div
        className={classNames(classes.card, {
          [classes.cardIsImage]: !template.isVideo,
          [classes.cardLoading]: isDeleting
        })}
        onClick={handleOnPreview}
        data-test="marketing-template"
      >
        {template.video ? (
          <video src={thumbnail} muted autoPlay />
        ) : (
          <img alt={template.name} src={thumbnail} className={classes.image} />
        )}

        <div className={classes.actions}>
          <div style={{ width: isInstance ? 'auto' : '100%' }}>
            <ActionButton
              onClick={e => {
                e.stopPropagation()

                if (isInstance) {
                  if (props.handleEdit) {
                    props.handleEdit(template)
                  }
                } else {
                  props.handleCustomize(template)
                }
              }}
              isBlock
              data-test="marketing-customize-button"
            >
              {isInstance ? 'Continue' : 'Customize'}
            </ActionButton>
          </div>

          {isInstance && (
            <div className={classes.actionsRight}>
              {props.handleDelete && (
                <Tooltip caption="Delete">
                  <IconButton
                    iconSize="large"
                    className={classes.actionsIconButton}
                    onClick={e => {
                      e.stopPropagation()
                      setDeleting(true)
                      props.handleDelete!({
                        template,
                        onCancel: () => {
                          setDeleting(false)
                        },
                        onFailed: () => {
                          setDeleting(false)
                          props.notify({
                            title:
                              'There is a problem for deleting the template. Please try again.',
                            status: 'error',
                            dismissible: true
                          })
                        }
                      })
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              )}
            </div>
          )}
        </div>
      </div>
      {isInstance && (
        <div className={classes.suffix}>
          {isDeleting ? (
            'Deleting...'
          ) : (
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

export default connect(
  ({ user }: IAppState) => ({ user }),
  { notify }
)(MarketingTemplateCard)
