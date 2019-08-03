import React from 'react'

import { InsightFiltersType } from './types'
import { doFilterOnInsightList } from './helpers'

function useFilterList(list, filter: InsightFiltersType) {
  const [
    activeFilter,
    setActiveFilter
  ] = React.useState<null | InsightFiltersType>(null)
  const [filteredList, setFilteredList] = React.useState([])
  const [stats, setStats] = React.useState({
    scheduled: 0,
    sent: 0
  })
  const hasFilterChanged = filter !== activeFilter
  const hasListItem = list.length > 0

  // Run only when filtering has changed or we got the list or the number of items has changed
  React.useEffect(
    function filterEffect() {
      const filtered = doFilterOnInsightList(list, filter)

      setActiveFilter(filter)
      setFilteredList(filtered.list)
      setStats(filtered.stats)
    },
    [filter, hasFilterChanged, hasListItem, list, list.length]
  )

  return {
    filteredList,
    stats
  }
}

export default useFilterList
