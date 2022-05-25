import { Box } from '@material-ui/core'

import SearchArticleErrorStateMessage from './SearchArticleErrorStateMessage'
import { RSSSearchErrorCode } from './types'

interface SearchArticleErrorStateProps {
  errorCode: RSSSearchErrorCode
}

function SearchArticleErrorState({ errorCode }: SearchArticleErrorStateProps) {
  return (
    <Box
      minHeight="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {errorCode === 'CloudflareProtected' && (
        <SearchArticleErrorStateMessage
          image="/static/icons/paper-unlink.svg"
          message="We are unable to load this article due to the copyright rules or the publisher's website's settings :("
        />
      )}
      {errorCode === 'MetadataNotFound' && (
        <SearchArticleErrorStateMessage
          image="/static/icons/paper-remove.svg"
          message="We couldn't find the article you were looking for. Please try searching again or inserting the correct URL link to the article."
        />
      )}
    </Box>
  )
}

export default SearchArticleErrorState
