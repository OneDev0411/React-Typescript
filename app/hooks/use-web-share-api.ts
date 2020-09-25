import { useState, useEffect } from 'react'

// ShareData type doesn't have `files` key ATM
interface ExtendedShareData extends ShareData {
  files?: File[]
}

interface UseWebShareApi {
  canShare: boolean
  share: () => Promise<void>
}

export function useWebShareApi(data: ExtendedShareData): UseWebShareApi {
  const [canShare, setCanShare] = useState(false)

  useEffect(() => {
    // navigator object doesn't have `canShare` method ATM
    // @ts-ignore
    if (!navigator.canShare) {
      return
    }

    // @ts-ignore
    setCanShare(navigator.canShare(data))
  }, [data])

  function share() {
    if (canShare) {
      return navigator.share(data)
    }

    return Promise.reject(
      new Error('Web Share API is not supported for passed data')
    )
  }

  return {
    canShare,
    share
  }
}
