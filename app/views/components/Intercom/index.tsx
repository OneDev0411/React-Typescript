import React from 'react'
import IntercomSDK from 'react-intercom'
import { useSelector, useDispatch } from 'react-redux'

import { selectUser } from 'selectors/user'

import { IAppState } from '../../../reducers'
import { inactiveIntercom } from '../../../store_actions/intercom'
import IconClose from '../SvgIcons/Close/CloseIcon'

import { Button, GlobalIntercomStyles } from './styled'

export default function Intercom() {
  const dispatch = useDispatch()
  const user = useSelector((state: IAppState) => selectUser(state))
  const { isActive: isIntercomActive } = useSelector(
    (state: IAppState) => state.intercom
  )

  const UserInfo =
    user && user.id
      ? {
          user_id: user.id,
          email: user.email,
          name: `${user.first_name} ${user.last_name}`
        }
      : {}

  return (
    <>
      <GlobalIntercomStyles />
      {(window as any).INTERCOM_ID && (
        <IntercomSDK
          appID={(window as any).INTERCOM_ID}
          alignment="left"
          horizontal_padding={8}
          vertical_padding={0}
          custom_launcher_selector=".open_intercom"
          {...UserInfo}
        />
      )}
      <Button
        title="Close"
        className="open_intercom"
        appearance="primary"
        onClick={() => dispatch(inactiveIntercom(isIntercomActive))}
        isActive={isIntercomActive}
      >
        <IconClose />
      </Button>
    </>
  )
}
