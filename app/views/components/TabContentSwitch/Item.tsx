import React from 'react'

export interface ItemProps<T = unknown> {
  value: T
  children: React.ReactNode
}

function Item<T = unknown>({ children }: ItemProps<T>) {
  return <>{children}</>
}

export default Item
