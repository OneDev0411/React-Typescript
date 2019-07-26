import React from 'react'

import fecha from 'fecha'

import ActionButton from 'components/Button/ActionButton'

interface IProps {
  onClick(): void
}

export function TodayButton(props: IProps) {
  return (
    <ActionButton
      size="small"
      appearance="outline"
      onClick={props.onClick}
      data-balloon={fecha.format(new Date(), 'dddd, MMMM DD')}
      data-balloon-pos="down"
      style={{ fontSize: '1rem' }}
    >
      Today
    </ActionButton>
  )
}
