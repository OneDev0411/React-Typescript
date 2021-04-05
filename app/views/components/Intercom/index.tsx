import { useEffect } from 'react'
import { useIntercom } from 'react-use-intercom'
import { useSelector, useDispatch } from 'react-redux'

import { selectUser } from 'selectors/user'

import { IAppState } from '../../../reducers'
import { deactivateIntercom } from '../../../store_actions/intercom'
import IconClose from '../SvgIcons/Close/CloseIcon'

import { Button, GlobalIntercomStyles } from './styled'

export default function Intercom() {
  const dispatch = useDispatch()
  const user = useSelector((state: IAppState) => selectUser(state))
  const { isActive: isIntercomActive } = useSelector(
    (state: IAppState) => state.intercom
  )

  const { boot } = useIntercom()

  // Read https://github.com/devrnt/react-use-intercom#useintercom for more options
  useEffect(() => {
    if (!user) {
      return
    }

    boot({
      userId: user.id,
      email: user.email,
      name: `${user.first_name} ${user.last_name}`,
      customAttributes: {
        custom_launcher_selector: '.open_intercom',
        vertical_padding: 0,
        horizontal_padding: 8,
        alignment: 'left'
      }
    })
  }, [boot, user])

  return (
    <>
      <GlobalIntercomStyles />

      <Button
        title="Close"
        className="open_intercom"
        appearance="primary"
        onClick={() => dispatch(deactivateIntercom(true))}
        isActive={isIntercomActive}
      >
        <IconClose />
      </Button>
    </>
  )
}
