import { Box } from '@material-ui/core'

function SearchVideoEmptyState() {
  return (
    <Box
      minHeight="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      There are no videos.
    </Box>
  )
}

export default SearchVideoEmptyState
