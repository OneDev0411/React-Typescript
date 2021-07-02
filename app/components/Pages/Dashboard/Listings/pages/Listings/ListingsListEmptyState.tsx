import { Box } from '@material-ui/core'

interface ListingsListEmptyStateProps {
  message: string
}

function ListingsListEmptyState({ message }: ListingsListEmptyStateProps) {
  return (
    <Box
      height={400}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {message}
    </Box>
  )
}

export default ListingsListEmptyState
