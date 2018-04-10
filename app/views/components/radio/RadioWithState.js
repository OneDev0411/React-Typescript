import React from 'react'
import compose from 'recompose/compose'
import withState from 'recompose/withState'

import Radio from './index'

const RadioWithState = props => {
  const { selected, stateSelected, setStateSlected, onClick } = props
  const isSelected = !!selected || stateSelected

  return (
    <Radio
      {...props}
      selected={isSelected}
      onClick={e => {
        setStateSlected(!stateSelected)
        onClick && onClick(e)
      }}
    />
  )
}

export default compose(withState('stateSelected', 'setStateSlected', false))(
  RadioWithState
)
