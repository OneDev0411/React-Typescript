import React, { ReactNode } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import { AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

import { selectIntercom } from '@app/selectors/intercom'
import { activateIntercom } from '@app/store_actions/intercom'

interface RenderProps {
  activateIntercom: ThunkDispatch<any, any, AnyAction>
  isIntercomActive: boolean
}

interface Props {
  render: (renderProps: RenderProps) => ReactNode
}

export function IntercomTrigger({ render }: Props) {
  const dispatch = useDispatch()
  const { isActive: isIntercomActive } = useSelector(selectIntercom)

  return (
    <span>
      {render({
        isIntercomActive,
        activateIntercom: () => dispatch(activateIntercom(isIntercomActive))
      })}
    </span>
  )
}
