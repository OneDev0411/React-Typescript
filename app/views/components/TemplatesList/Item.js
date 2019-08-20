import React, { useState } from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'

import IconButton from 'components/Button/IconButton'
import ActionButton from 'components/Button/ActionButton'
import DeleteIcon from 'components/SvgIcons/DeleteOutline/IconDeleteOutline'

import { getThumbnail, itemButtonText, itemDateText } from './helpers'

function Item(props) {
  const [isDeleting, setDeleting] = useState(false)
  const thumbnail = getThumbnail(props.template)
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
        <div className="action-bar">
          {isInstance && props.handleDelete && (
            <IconButton
              onClick={e => {
                e.stopPropagation()
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
              }}
              className="actionbar-delete"
            >
              <DeleteIcon />
            </IconButton>
          )}

          {isInstance && props.handleEdit && (
            <ActionButton
              onClick={e => {
                e.stopPropagation()

                props.handleEdit(props.template)
              }}
              isBlock
            >
              Edit
            </ActionButton>
          )}

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
        {props.template.video ? (
          <video src={thumbnail} muted autoPlay />
        ) : (
          <img alt={props.template.name} src={thumbnail} />
        )}
      </div>
      {isInstance && (
        <div className="template_date">
          {itemDateText(props.template.created_at, isDeleting)}
        </div>
      )}
    </div>
  )
}

export default connect(
  null,
  { notify }
)(Item)
