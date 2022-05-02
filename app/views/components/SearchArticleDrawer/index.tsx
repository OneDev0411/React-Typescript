import { useEffect, ChangeEvent, useState, useCallback, useRef } from 'react'

import { Box, Button, makeStyles, Typography } from '@material-ui/core'
import { SuperAgentRequest } from 'superagent'

import useAsync from '@app/hooks/use-async'
import { prependHTTPSIfNeeded, isValidUrl } from '@app/utils/url'
import { PLACEHOLDER_IMAGE_URL } from '@app/views/components/InstantMarketing/constants'
import OverlayDrawer from 'components/OverlayDrawer'

import { SearchInput } from '../GlobalHeaderWithSearch/SearchInput'
import LoadingContainer from '../LoadingContainer'
import { NO_IMAGE_URL } from '../SearchResultCard'

import { RSS_SOURCES } from './constants'
import { isRSSSearchErrorCode } from './helpers'
import { getUrlMetadataRequest } from './models'
import SearchArticleEmptyState from './SearchArticleEmptyState'
import SearchArticleErrorState from './SearchArticleErrorState'
import SearchArticleImageCacheProvider from './SearchArticleImageCacheProvider'
import SearchArticleResults from './SearchArticleResults'
import {
  ArticleMetadata,
  RSSArticleMetadata,
  RSSSearchErrorCode
} from './types'
import { useCreateImageCache } from './use-create-image-cache'
import { useSearchArticles } from './use-search-articles'

const useStyles = makeStyles(
  theme => ({
    body: {
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      padding: theme.spacing(0, 0, 2, 0)
    },
    results: {
      overflowX: 'hidden',
      overflowY: 'auto'
    },
    selected: {
      color: theme.palette.grey[800],
      paddingLeft: theme.spacing(0.5)
    }
  }),
  { name: 'SearchArticleDrawer' }
)

interface BaseSearchArticleDrawerProps {
  isOpen: boolean
  onClose?: () => void
}

interface SingleSearchArticleDrawerProps extends BaseSearchArticleDrawerProps {
  onSelect: (article: RSSArticleMetadata) => void
  multipleSelection?: false
}

interface MultiSearchArticleDrawerProps extends BaseSearchArticleDrawerProps {
  onSelect: (articles: RSSArticleMetadata[]) => void
  multipleSelection: true
}

type SearchArticleDrawerProps =
  | SingleSearchArticleDrawerProps
  | MultiSearchArticleDrawerProps

function SearchArticleDrawer({
  isOpen,
  onSelect,
  onClose,
  multipleSelection
}: SearchArticleDrawerProps) {
  const classes = useStyles()
  const {
    data: results,
    setData: setResults,
    run,
    isLoading
  } = useAsync<RSSArticleMetadata[]>({ data: [] })
  const [selected, setSelected] = useState<RSSArticleMetadata[]>([])
  const imageCache = useCreateImageCache()
  const getUrlMetadataRequestRef = useRef<Optional<SuperAgentRequest>>()
  const [searchErrorCode, setSearchErrorCode] =
    useState<Nullable<RSSSearchErrorCode>>(null)

  const { searchArticles, isArticlesLoading, allArticles } =
    useSearchArticles(RSS_SOURCES)

  const handleSearch = useCallback(
    (term: string) => {
      setSearchErrorCode(null)

      const searchTerm = term.trim()

      run(async () => {
        if (!searchTerm) {
          return allArticles
        }

        const searchTermWithHTTPSPrefix = prependHTTPSIfNeeded(searchTerm)

        if (!isValidUrl(searchTermWithHTTPSPrefix)) {
          return searchArticles(searchTerm)
        }

        try {
          // Abort the previous request to avoid delay problems
          if (getUrlMetadataRequestRef.current) {
            getUrlMetadataRequestRef.current.abort()
            getUrlMetadataRequestRef.current = undefined
          }

          // Create a new request
          getUrlMetadataRequestRef.current = getUrlMetadataRequest(
            searchTermWithHTTPSPrefix
          )

          // Waiting for the response and extract it
          const articleMetadata: Nullable<ArticleMetadata> =
            (await getUrlMetadataRequestRef.current).body.response ?? null

          // Delete the request object because the response is ready
          getUrlMetadataRequestRef.current = undefined

          // Handle the invalid link state
          if (!articleMetadata) {
            return []
          }

          // Update the image cache with the url and image
          imageCache.setItem(
            searchTermWithHTTPSPrefix,
            articleMetadata.image ?? NO_IMAGE_URL
          )

          // Put the article on the results list
          return [
            {
              image: articleMetadata.image,
              title: articleMetadata.title ?? '',
              url: articleMetadata.url ?? searchTermWithHTTPSPrefix,
              description: articleMetadata.description
            }
          ]
        } catch (e) {
          const errorCode: Optional<string> = e.response.body?.errorCode

          if (isRSSSearchErrorCode(errorCode)) {
            setSearchErrorCode(errorCode)
          } else {
            setSearchErrorCode('MetadataNotFound')
          }

          return []
        }
      })
    },
    [allArticles, imageCache, run, searchArticles, setSearchErrorCode]
  )

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) =>
    handleSearch(event.target.value)

  const getArticleWithImage = (
    article: RSSArticleMetadata
  ): RSSArticleMetadata => ({
    ...article,
    image:
      article.image || imageCache.getItem(article.url) || PLACEHOLDER_IMAGE_URL
  })

  const handleConfirm = () => {
    // TODO: Fix the below error
    onSelect(
      // @ts-ignore
      multipleSelection
        ? selected.map(getArticleWithImage)
        : getArticleWithImage(selected[0])
    )

    setSelected([])
  }

  const handleClose = () => {
    setSelected([])
    onClose?.()
  }

  const handleSelect = (article: RSSArticleMetadata) => {
    // Handle the single selection mode
    if (!multipleSelection) {
      setSelected([article])

      return
    }

    const articleIndex = selected.findIndex(
      selected => selected.url === article.url
    )

    // Add the item into the selection list if not exists
    if (articleIndex == -1) {
      setSelected(selected => [...selected, article])

      return
    }

    // Remove the item from the selection list if exists
    const newSelected = [...selected]

    newSelected.splice(articleIndex, 1)

    setSelected(newSelected)
  }

  // Load initial videos using the initial term
  useEffect(() => {
    if (!isArticlesLoading && isOpen) {
      setResults(allArticles) // Display all articles when the drawer comes up
    }
  }, [isArticlesLoading, handleSearch, isOpen, setResults, allArticles])

  const isLoadingState = isLoading || isArticlesLoading
  const isEmptyState = !isLoadingState && results.length === 0

  return (
    <OverlayDrawer open={isOpen} onClose={handleClose} width="690px">
      <OverlayDrawer.Header title="Search for Articles" />
      <OverlayDrawer.Body className={classes.body}>
        <Box flex={0} px={3} py={2}>
          <SearchInput
            debounceTime={250}
            isLoading={isLoadingState}
            onChange={handleSearchChange}
            placeholder="Search for a subject or paste a link"
            fullWidth
          />
        </Box>
        <Box flex={1} className={classes.results} pl={3}>
          <SearchArticleImageCacheProvider imageCache={imageCache}>
            {isLoadingState ? (
              <LoadingContainer />
            ) : searchErrorCode ? (
              <SearchArticleErrorState errorCode={searchErrorCode} />
            ) : isEmptyState ? (
              <SearchArticleEmptyState />
            ) : (
              <SearchArticleResults
                results={results}
                selected={selected}
                onSelect={handleSelect}
              />
            )}
          </SearchArticleImageCacheProvider>
        </Box>
      </OverlayDrawer.Body>
      <OverlayDrawer.Footer>
        {selected.length ? (
          <Typography className={classes.selected} variant="body2">
            {selected.length} Selected
          </Typography>
        ) : (
          <span />
        )}
        <Button
          disabled={isLoadingState || selected.length === 0}
          color="primary"
          variant="contained"
          onClick={handleConfirm}
        >
          Done
        </Button>
      </OverlayDrawer.Footer>
    </OverlayDrawer>
  )
}

export default SearchArticleDrawer
