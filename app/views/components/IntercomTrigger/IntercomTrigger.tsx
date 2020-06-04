import React, { ReactNode } from 'react'
import { AnyAction } from 'redux'
import { useSelector, useDispatch } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'

import { IAppState } from '../../../reducers'
import { activeIntercom } from '../../../store_actions/intercom'

interface RenderProps {
  activeIntercom: ThunkDispatch<any, any, AnyAction>
  isIntercomActive: boolean
}

interface Props {
  render: (renderProps: RenderProps) => ReactNode
}

export function IntercomTrigger(props: Props) {
  const dispatch = useDispatch()
  const { isActive: isIntercomActive } = useSelector(
    (state: IAppState) => state.intercom
  )

  return (
    <span>
      {props.render({
        isIntercomActive,
        activeIntercom: () => dispatch(activeIntercom(isIntercomActive))
      })}
    </span>
  )
}
