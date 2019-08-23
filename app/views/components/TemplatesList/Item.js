import React, { useState } from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'

import { getBrandByType } from 'utils/user-teams'

import IconButton from 'components/Button/IconButton'
import ActionButton from 'components/Button/ActionButton'
import DeleteIcon from 'components/SvgIcons/DeleteOutline/IconDeleteOutline'
import EditIcon from 'components/SvgIcons/Edit/EditIcon'
import Tooltip from 'components/tooltip'

import { getTemplateImage, itemButtonText, itemDateText } from './helpers'

function Item(props) {
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
    <div key={template.id}>
      <div
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

                props.handleCustomize(template)
              }}
              isBlock
              data-test="marketing-customize-button"
            >
              {itemButtonText(template)}
            </ActionButton>
          </div>

          {isInstance && (
            <div className="action-bar__right">
              {props.handleEdit && (
                <Tooltip caption="Edit">
                  <IconButton
                    iconSize="large"
                    className="action-bar__icon-button"
                    onClick={e => {
                      e.stopPropagation()
                      props.handleEdit(template)
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              )}
              {props.handleDelete && (
                <Tooltip caption="Delete">
                  <IconButton
                    iconSize="large"
                    className="action-bar__icon-button"
                    onClick={e => {
                      e.stopPropagation()
                      setDeleting(true)
                      props.handleDelete({
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
        <div className="template-date">
          {isDeleting ? (
            'Deleting...'
          ) : (
            <>
              <div className="caption">CREATED AT</div>
              {itemDateText(template.created_at)}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default connect(
  ({ user }) => ({ user }),
  { notify }
)(Item)
