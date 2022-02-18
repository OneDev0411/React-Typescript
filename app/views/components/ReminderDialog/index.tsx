import { useState } from 'react'

import { useDispatch } from 'react-redux'

import { useUnsafeActiveTeam } from '@app/hooks/team/use-unsafe-active-team'
import { setActiveTeamSetting } from '@app/store_actions/active-team'
import { getSettingFromTeam } from '@app/utils/user-teams'

import { ReminderPopper } from './ReminderPopper'
import { ReminderDialogBaseProps } from './types'

export function ReminderDialog({
  userSettingsKey,
  ...rest
}: ReminderDialogBaseProps) {
  const dispatch = useDispatch()
  const activeTeam = useUnsafeActiveTeam()
  const [isOpen, setIsOpen] = useState(
    !getSettingFromTeam(activeTeam, userSettingsKey, false)
  )

  const onClickGotIt = (dontShow: boolean) => {
    if (dontShow) {
      dispatch(setActiveTeamSetting(userSettingsKey, true))
    }

    setIsOpen(false)
  }

  return <ReminderPopper open={isOpen} onClickGotIt={onClickGotIt} {...rest} />
}
