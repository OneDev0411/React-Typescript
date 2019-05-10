import { useEffect, useState } from 'react'

import getCampaings from '../../../../../models/insights/emails/get-all-campaigns'

function useListData(user, queue) {
  const [isLoading, setLoading] = useState(true)
  const [hasError, setError] = useState(false)
  const [list, setList] = useState([])

  useEffect(() => {
    setLoading(true)

    getCampaings(user).then(data => {
      setError(false)
      setLoading(false)
      setList(data)
    })
    // .catch(() => {
    //   setError(true)
    //   setLoading(false)
    //   setList([])
    // })
  }, [user, queue])

  return {
    list,
    isLoading,
    hasError
  }
}

export default useListData
