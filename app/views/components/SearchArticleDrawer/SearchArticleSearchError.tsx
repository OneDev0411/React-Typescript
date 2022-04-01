import { Box } from '@material-ui/core'

import { RSSSearchErrorCode } from './types'

interface SearchArticleSearchErrorProps {
  errorCode: RSSSearchErrorCode
}

function SearchArticleSearchError({
  errorCode
}: SearchArticleSearchErrorProps) {
  return (
    <Box
      minHeight="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {errorCode === 'CloudflareProtected' && (
        <>
          We are unable to load this article due to the copyright rules or the
          publisher's website's settings :(
        </>
      )}
      {errorCode === 'MetadataNotFound' && (
        <>
          We couldn't find the article you were looking for. Please try
          searching again or inserting the correct URL link to the article.
        </>
      )}
    </Box>
  )
}

export default SearchArticleSearchError
