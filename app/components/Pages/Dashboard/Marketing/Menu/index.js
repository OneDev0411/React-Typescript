import React from 'react'

import { items } from './data'
import { ActiveItem } from './ActiveItem'
import { ComingSoonItem } from './ComingSoonItem'

export function Menu() {
  return (
    <React.Fragment>
      <div style={{ marginBottom: '2.5em' }}>
        <ActiveItem indexed text="Marketing Center" to="/dashboard/marketing" />
        <ActiveItem text="All My Designs" to="/dashboard/marketing/history" />
      </div>

      {items.map(({ title, url }, index) =>
        url ? (
          <ActiveItem
            key={index}
            indexed={url === '/'}
            text={title}
            to={`/dashboard/marketing${url}`}
          />
        ) : (
          <ComingSoonItem text={title} key={index} />
        )
      )}
    </React.Fragment>
  )
}
