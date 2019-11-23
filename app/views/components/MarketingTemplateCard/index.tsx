import React, { useState } from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'

import { getBrandByType } from 'utils/user-teams'

import { getTemplateImage, itemDateText } from 'utils/marketing-center/helpers'

import { IAppState } from 'reducers/index'

import IconButton from '../Button/IconButton'
import ActionButton from '../Button/ActionButton'
import DeleteIcon from '../SvgIcons/DeleteOutline/IconDeleteOutline'
import Tooltip from '../tooltip'
import {
  MarketingTemplateCardContainer,
  MarketingTemplateCardRoot,
  TemplateDate
} from './styled'

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

function MarketingTemplateCard(props: Props) {
  const { template } = props
  const [isDeleting, setDeleting] = useState(false)
  const brokerageBrand = getBrandByType(props.user, 'Brokerage')

  const { thumbnail } = getTemplateImage(template, brokerageBrand)

  const isInstance = template.type === 'template_instance'
  const gridClassNames = ['grid-item']
  let handleOnPreview = () => props.handlePreview(template)

  if (isDeleting) {
    gridClassNames.push('loading')
  }

  if (template.video) {
    gridClassNames.push('is-video')
    handleOnPreview = () => false
  }

  return (
    <MarketingTemplateCardContainer key={template.id} isInstance={isInstance}>
      <MarketingTemplateCardRoot
        className={gridClassNames.join(' ')}
        onClick={handleOnPreview}
        data-test="marketing-template"
      >
        {template.video ? (
          <video src={thumbnail} muted autoPlay />
        ) : (
          <img alt={template.name} src={thumbnail} />
        )}

        <div className="action-bar">
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
            <div className="action-bar__right">
              {props.handleDelete && (
                <Tooltip caption="Delete">
                  <IconButton
                    iconSize="large"
                    className="action-bar__icon-button"
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
      </MarketingTemplateCardRoot>
      {isInstance && (
        <TemplateDate>
          {isDeleting ? (
            'Deleting...'
          ) : (
            <>
              <div className="caption">CREATED AT</div>
              {itemDateText(template.created_at)}
            </>
          )}
        </TemplateDate>
      )}
    </MarketingTemplateCardContainer>
  )
}

export default connect(
  ({ user }: IAppState) => ({ user }),
  { notify }
)(MarketingTemplateCard)
