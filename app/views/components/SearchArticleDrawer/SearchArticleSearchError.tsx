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
        <Box pr={4}>
          <ul>
            <li>
              We are unable to load this article due to the copyright rules or
              the publisher's website's settings :(
            </li>
            <li>
              We couldn't find the article you were looking for. Please try
              searching again or inserting the correct URL link to the article.
            </li>
          </ul>
        </Box>
      )}
      {errorCode === 'MetadataNotFound' && (
        <div>
          Unable to load article due to one of these reasons:
          <ul>
            <li>Copyright rules</li>
            <li>Publisher website setting</li>
            <li>Wrong URL</li>
          </ul>
        </div>
      )}
    </Box>
  )
}

export default SearchArticleSearchError
