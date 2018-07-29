import React from 'react'

import { Item } from './Item'

export function TouchesList(props) {
  return (
    <div className="c-tasks-timeline">
      {props.touches.length === 0 ? (
        <div className="empty-list">
          <img
            alt="notepad"
            src="/static/images/contacts/notepad-edit-231.svg"
          />
          <p>There are no touch yet</p>
        </div>
      ) : (
        props.touches.map(touch => (
          <Item
            touch={touch}
            onClick={props.handleOnClick}
            key={`touch_${touch.id}`}
          />
        ))
      )}
    </div>
  )
}
