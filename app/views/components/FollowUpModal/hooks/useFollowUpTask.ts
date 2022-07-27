import { useState, useCallback } from 'react'

import { useEffectOnce } from 'react-use'

interface BaseData {
  event?: any
  email?: any
}
type Data = RequireOnlyOne<BaseData, 'email' | 'event'>
interface UseFollowUpTaskReturn {
  isCreatingFollowUpTask: boolean
  createFollowUpTask: (timestamp: number) => void
}

export function useFollowUpTask({ event, email }: Data): UseFollowUpTaskReturn {
  const [isCreatingTask, setIsCreatingTask] = useState<boolean>(false)

  const createFollowUpTask = useCallback((timestamp: number) => {
    console.log('createFollowUpTask', { timestamp })
  }, [])

  useEffectOnce(() => {})

  return { isCreatingFollowUpTask: isCreatingTask, createFollowUpTask }
}
