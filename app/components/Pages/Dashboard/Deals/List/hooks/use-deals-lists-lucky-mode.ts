import { useEffect } from 'react'

import { useQueryParam } from '@app/hooks/use-query-param'
import { goTo } from '@app/utils/go-to'

/**
 * Open the first deal on the list if the lucky flag exists on the query string
 * @param deals The deals list
 * @param isLoading The deals loading state
 */
function useDealsListsLuckyMode(deals: IDeal[], isLoading: boolean) {
  const [lucky, , deleteLucky] = useQueryParam('lucky')
  const isLuckyMode = !!lucky

  useEffect(() => {
    if (isLuckyMode && !isLoading && deals.length === 1) {
      // The deal close button uses the history.goBack() method to redirect the user
      // to the previous page. In this case, this method does not work, and it will
      // redirect the user to the deal page again because of the lucky param.
      // So we need to delete the lucky param and then go to the deal page to prevent
      // the redirect issue.
      deleteLucky()
      goTo(`/dashboard/deals/${deals[0].id}`)
    }
  }, [deals, deleteLucky, isLoading, isLuckyMode])
}

export default useDealsListsLuckyMode
