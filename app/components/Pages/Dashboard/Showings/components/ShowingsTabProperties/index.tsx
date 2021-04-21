import { Box } from '@material-ui/core'

import ShowingPropertyList from '../ShowingPropertyList'
import ShowingStats from '../ShowingStats'

function ShowingsTabProperties() {
  return (
    <>
      <Box my={4}>
        <ShowingStats />
      </Box>
      <ShowingPropertyList />
    </>
  )
}

export default ShowingsTabProperties
