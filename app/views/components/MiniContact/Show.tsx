import React from 'react'

interface ShowPropsType {
  if: boolean
  children: JSX.Element
}

function Show(props: ShowPropsType) {
  if (!props.if) {
    return null
  }

  return props.children
}

export default Show
