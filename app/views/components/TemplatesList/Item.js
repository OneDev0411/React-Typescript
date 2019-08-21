import React, { useState } from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'

import IconButton from 'components/Button/IconButton'
import ActionButton from 'components/Button/ActionButton'
import DeleteIcon from 'components/SvgIcons/DeleteOutline/IconDeleteOutline'
import EditIcon from 'components/SvgIcons/Edit/EditIcon'
import Tooltip from 'components/tooltip'

import { getThumbnail, itemButtonText, itemDateText } from './helpers'

function Item(props) {
  const [isDeleting, setDeleting] = useState(false)
  const thumbnail = getThumbnail(props.template, props.user)
  const isInstance = props.template.type === 'template_instance'
  const gridClassNames = ['grid-item']

  if (isDeleting) {
    gridClassNames.push('loading')
  }

  return (
    <div key={props.template.id}>
      <div
        className={gridClassNames.join(' ')}
        onClick={() => props.handlePreview(props.template)}
        data-test="marketing-template"
      >
        {props.template.video ? (
          <video src={thumbnail} muted autoPlay />
        ) : (
          <img alt={props.template.name} src={thumbnail} />
        )}

        <div className="action-bar">
          <div style={{ width: isInstance ? 'auto' : '100%' }}>
            <ActionButton
              onClick={e => {
                e.stopPropagation()

                props.handleCustomize(props.template)
              }}
              isBlock
              data-test="marketing-customize-button"
            >
              {itemButtonText(props.template)}
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
                      props.handleEdit(props.template)
                      e.stopPropagation()
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
                      setDeleting(true)
                      props.handleDelete({
                        template: props.template,
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
                      e.stopPropagation()
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
              {itemDateText(props.template.created_at)}
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
