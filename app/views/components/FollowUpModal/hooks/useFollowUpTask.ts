import { useMemo, useState, useCallback } from 'react'

import { useEffectOnce } from 'react-use'

import {
  getInitialDate,
  GetInitialDateReturn
} from '../helper/get-initial-date'
import { FollowUpEmail } from '../types'

interface BaseData {
  event?: any
  email?: FollowUpEmail
  baseDate?: Date
}
type Data = RequireOnlyOne<BaseData, 'email' | 'event'>
interface UseFollowUpTaskReturn {
  isCreatingFollowUpTask: boolean
  validDate: GetInitialDateReturn
  createFollowUpTask: (timestamp: number) => void
}

export function useFollowUpTask({
  event,
  email,
  baseDate
}: Data): UseFollowUpTaskReturn {
  const [isCreatingTask, setIsCreatingTask] = useState<boolean>(false)
  const validDate = useMemo(() => getInitialDate(baseDate), [baseDate])
  const createFollowUpTask = useCallback((timestamp: number) => {
    console.log('createFollowUpTask', { timestamp })
  }, [])

  useEffectOnce(() => {})

  return {
    isCreatingFollowUpTask: isCreatingTask,
    createFollowUpTask,
    validDate
  }
}
