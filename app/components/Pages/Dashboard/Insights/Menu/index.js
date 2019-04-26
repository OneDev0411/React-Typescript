import React from 'react'

import { ActiveItem } from './ActiveItem'

const items = [
  {
    title: 'Sent',
    url: '/'
  }
]

function Menu() {
  return (
    <React.Fragment>
      <div className="onboarding--menus">
        {items.map(({ title, url }, index) => (
          <ActiveItem
            key={index}
            indexed={url === '/'}
            text={title}
            selected={window.location.pathname.includes(url)}
            to={`/dashboard/insights${url}`}
          />
        ))}
      </div>
    </React.Fragment>
  )
}

export default Menu
