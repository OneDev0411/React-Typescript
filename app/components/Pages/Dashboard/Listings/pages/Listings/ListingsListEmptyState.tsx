import { Box } from '@material-ui/core'

function ListingsListEmptyState() {
  return (
    <Box
      height={400}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      There are no listings.
    </Box>
  )
}

export default ListingsListEmptyState
