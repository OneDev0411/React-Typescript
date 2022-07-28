import { useMemo, useState, useCallback } from 'react'

import useNotify from '@app/hooks/use-notify'
import { useUser } from '@app/hooks/use-user'
import { createTask } from '@app/models/tasks/create-task'
import { noop } from '@app/utils/helpers'
import { preSaveFormat } from 'components/EventDrawer/helpers/pre-save-format'

import { Props as FollowUpModalProps } from '../FollowUpModal'
import { getFollowUpCrmTask } from '../helper/get-follow-up-crm-task'
import {
  getInitialDate,
  GetInitialDateReturn
} from '../helper/get-initial-date'
import { FollowUpEmail } from '../types'

interface BaseData {
  event?: any
  email?: FollowUpEmail
  baseDate?: Date
  dictionary?: FollowUpModalProps['dictionary']
}
type Data = RequireOnlyOne<BaseData, 'email' | 'event'>

interface UseFollowUpTaskReturn {
  isCreatingFollowUpTask: boolean
  validDate: GetInitialDateReturn
  createFollowUpTask: (timestamp: number) => void
}

export function useFollowUpTask(
  { event, email, baseDate, dictionary }: Data,
  callback: (e: IEvent) => void = noop
): UseFollowUpTaskReturn {
  const user = useUser()
  const notify = useNotify()

  const [isCreatingTask, setIsCreatingTask] = useState<boolean>(false)
  const validDate = useMemo(() => getInitialDate(baseDate), [baseDate])

  /*
    Creating a follow up task based on an existing event
  */
  // const createFollowUpForEvent = useCallback(async (timestamp: number) => {
  //   console.log('createFollowUpTask', { timestamp })
  // }, [])

  /*
    Creating a follow up task based on an email
  */
  const createFollowUpForEmail = useCallback(
    async (timestamp: number) => {
      const task = await preSaveFormat(
        getFollowUpCrmTask(email, new Date(timestamp), user, dictionary)
      )
      const followUpTask = await createTask(task)

      return followUpTask
    },
    [dictionary, email, user]
  )

  const createFollowUpTask = useCallback(
    async (timestamp: number) => {
      setIsCreatingTask(true)

      const followUpTask = await createFollowUpForEmail(timestamp)

      callback(followUpTask)

      setIsCreatingTask(false)
      notify({
        status: 'success',
        message: 'The follow up task is added!'
      })
    },
    [callback, createFollowUpForEmail, notify]
  )

  return {
    isCreatingFollowUpTask: isCreatingTask,
    createFollowUpTask,
    validDate
  }
}
