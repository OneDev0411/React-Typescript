import { useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { selectUserUnsafe } from '@app/selectors/user'
import { setUserSetting } from '@app/store_actions/user/set-setting'
import { getUserSettingsInActiveTeam } from '@app/utils/user-teams'

import { ReminderPopper } from './ReminderPopper'
import { ReminderDialogBaseProps } from './types'

export function ReminderDialog({
  userSettingsKey,
  ...rest
}: ReminderDialogBaseProps) {
  const user = useSelector(selectUserUnsafe)
  const dispatch = useDispatch()

  const [isOpen, setIsOpen] = useState(
    user ? !getUserSettingsInActiveTeam(user, userSettingsKey) : false
  )

  const onClickGotIt = (dontShow: boolean) => {
    if (dontShow) {
      dispatch(setUserSetting(userSettingsKey, true))
    }

    setIsOpen(false)
  }

  return <ReminderPopper open={isOpen} onClickGotIt={onClickGotIt} {...rest} />
}
