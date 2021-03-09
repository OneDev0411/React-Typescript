import { Children, ReactElement } from 'react'

import type { ItemProps } from './Item'

type Child<T> = ReactElement<ItemProps<T>> | undefined

export interface ContainerProps<T = unknown> {
  value: T
  children: Child<T> | (Child<T> | false)[]
}

function Container<T = unknown>({ value, children }: ContainerProps<T>) {
  return (
    Children.toArray(children).find(
      child => !!child && value === child!.props.value
    ) || null
  )
}

export default Container
