import { searchEvents } from 'models/tasks/search-events'

import getOpenHouseFilter from './get-open-house-filter'

const getOpenHouseEvents = async () => {
  const result = await searchEvents({ task_type: 'Open House' })

  return result.data.map(getOpenHouseFilter)
}

export default getOpenHouseEvents
