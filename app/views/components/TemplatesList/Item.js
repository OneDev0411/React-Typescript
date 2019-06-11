import React from 'react'

import Button from 'components/Button/ActionButton'

import { getThumbnail, createdAt } from './helpers'

function Item(props) {
  const thumbnail = getThumbnail(props.template)
  const isInstance = props.template.type === 'template_instance'
  const isVideo = false
  const editButtonText = 'Customize'

  return (
    <div key={props.template.id}>
      <div className="grid-item">
        <img alt={props.template.name} src={thumbnail} />
        <div className="action-bar">
          {!isVideo && (
            <Button
              appearance="outline"
              onClick={() => props.handlePreview(props.template)}
              style={{ backgroundColor: '#FFF' }}
            >
              Preview
            </Button>
          )}
          <Button onClick={() => props.handleCustomize(props.template)}>
            {editButtonText}
          </Button>
        </div>
      </div>
      {isInstance && (
        <div className="template_date">
          {`Created ${createdAt(props.template.created_at)}`}
        </div>
      )}
    </div>
  )
}

export default Item
