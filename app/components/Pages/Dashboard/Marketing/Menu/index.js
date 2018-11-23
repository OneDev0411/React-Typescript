import React from 'react'

import { items } from './data'
import { ActiveItem } from './ActiveItem'
import { ComingSoonItem } from './ComingSoonItem'

export function Menu() {
  return items.map(({ title, url }, index) =>
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
  )
}
