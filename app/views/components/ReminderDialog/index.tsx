import { useState } from 'react'

import { PopperPlacementType } from '@material-ui/core/Popper'
import { ReferenceObject } from 'popper.js'
import { useDispatch, useSelector } from 'react-redux'

import { selectUserUnsafe } from '@app/selectors/user'
import { setUserSetting } from '@app/store_actions/user/set-setting'
import { getUserSettingsInActiveTeam } from '@app/utils/user-teams'

import { ReminderPopper } from './reminderPopper'

export interface Props {
  userSettingsKey: string
  anchorEl: Nullable<ReferenceObject | (() => ReferenceObject)>
  title: string
  buttonText?: string
  checkboxText?: string
  image?: string
  placement?: PopperPlacementType
}

export function ReminderDialog({ userSettingsKey, ...rest }: Props) {
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
