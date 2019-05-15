import React from 'react'

import { ActiveItem } from './ActiveItem'

Menu.defaultProps = {
  items: []
}

function Menu(props) {
  return (
    <React.Fragment>
      <div className="onboarding--menus">
        {props.items.map((item, index) => (
          <ActiveItem key={index} item={item} base="/dashboard/insights" />
        ))}
      </div>
    </React.Fragment>
  )
}

export default Menu
