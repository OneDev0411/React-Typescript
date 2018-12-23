import React from 'react'

import { items } from './data'
import { ActiveItem } from './ActiveItem'
import { ComingSoonItem } from './ComingSoonItem'
import IconAllDesigns from '../components/IconAllDesigns/IconAllDesigns'
import IconMyDesigns from '../components/IconMyDesigns/IconMyDesigns'

export function Menu() {
  return (
    <React.Fragment>
      <div style={{ marginBottom: '2.5em' }}>
        <ActiveItem
          indexed
          text="All Designs"
          Icon={IconAllDesigns}
          to="/dashboard/marketing"
          className="onboarding--all-designs"
        />
        <ActiveItem
          text="My Designs"
          Icon={IconMyDesigns}
          to="/dashboard/marketing/history"
          className="onboarding--my-designs"
        />
      </div>

      <div className="onboarding--menus">
        {items.map(
          ({ title, url }, index) =>
            url ? (
              <ActiveItem
                key={index}
                indexed={url === '/'}
                text={title}
                selected={window.location.pathname.includes(url)}
                to={`/dashboard/marketing${url}`}
              />
            ) : (
              <ComingSoonItem text={title} key={index} />
            )
        )}
      </div>
    </React.Fragment>
  )
}
