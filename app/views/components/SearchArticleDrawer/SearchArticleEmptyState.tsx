import { Box } from '@material-ui/core'

function SearchArticleEmptyState() {
  return (
    <Box
      minHeight="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      There are no articles.
    </Box>
  )
}

export default SearchArticleEmptyState
