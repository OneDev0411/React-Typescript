import React, { Children, ReactElement } from 'react'

import type { ItemProps } from './Item'

type Item<T> = ReactElement<ItemProps<T>>
type ItemOrBoolean<T> = Item<T> | boolean | undefined

export interface ContainerProps<T = unknown> {
  value: T
  children: ItemOrBoolean<T> | ItemOrBoolean<T>[]
}

function Container<T = unknown>({ value, children }: ContainerProps<T>) {
  const child = Children.toArray(children).find(child => {
    // I know the children type but `.toArray()` is not a generic method, so
    // I have to use the below type cast to fix the type issues
    const item = child as ItemOrBoolean<T>

    return !!item && typeof item !== 'boolean' && value === item.props.value
  })

  return <>{child}</>
}

export default Container
