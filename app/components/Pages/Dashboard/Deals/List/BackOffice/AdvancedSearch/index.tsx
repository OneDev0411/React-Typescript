import Grid from '../Grid'
import { SearchQuery } from '../types'

import { Filters } from './Filters'

interface Props {
  searchQuery: SearchQuery
  statuses: IDealStatus[]
}

function AdvancedSearch({ searchQuery, statuses }: Props) {
  return (
    <>
      <Filters />
      <Grid searchQuery={searchQuery} statuses={statuses} />
    </>
  )
}

export default AdvancedSearch
