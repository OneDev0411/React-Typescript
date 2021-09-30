import { useEffect, ChangeEvent, useState, useCallback } from 'react'

import { Box, Button, makeStyles } from '@material-ui/core'

import useAsync from '@app/hooks/use-async'
import OverlayDrawer from 'components/OverlayDrawer'

import { SearchInput } from '../GlobalHeaderWithSearch'
import LoadingContainer from '../LoadingContainer'

import { RSS_SOURCES, INITIAL_SEARCH_TERM } from './constants'
import { isValidUrl } from './helpers'
import { getUrlMetadata } from './models'
import SearchArticleEmptyState from './SearchArticleEmptyState'
import SearchArticleImageCacheProvider from './SearchArticleImageCacheProvider'
import SearchArticleResults from './SearchArticleResults'
import { RSSArticleMetadata } from './types'
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
    run,
    isLoading
  } = useAsync<RSSArticleMetadata[]>({ data: [] })
  const [selected, setSelected] = useState<RSSArticleMetadata[]>([])

  const { searchArticles, isArticlesLoading, allArticles } =
    useSearchArticles(RSS_SOURCES)

  const handleSearch = useCallback(
    (term: string) => {
      const searchTerm = term.trim()

      run(async () => {
        if (!searchTerm) {
          return allArticles
        }

        if (!isValidUrl(searchTerm)) {
          return searchArticles(searchTerm)
        }

        try {
          const articleMetadata = await getUrlMetadata(searchTerm)

          return [
            {
              image: articleMetadata?.image,
              title: articleMetadata?.title ?? '',
              url: articleMetadata?.url ?? ''
            }
          ]
        } catch (_) {
          return []
        }
      })
    },
    [allArticles, run, searchArticles]
  )

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) =>
    handleSearch(event.target.value)

  const handleInsert = () => {
    // TODO: Fix the below error
    // @ts-ignore
    onSelect(multipleSelection ? selected : selected[0])

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

    // Add the item into the selection list if not exists
    if (!selected.includes(article)) {
      setSelected(selected => [...selected, article])

      return
    }

    // Remove the item from the selection list if exists
    const index = selected.indexOf(article)
    const newSelected = [...selected]

    newSelected.splice(index, 1)

    setSelected(newSelected)
  }

  // Load initial videos using the initial term
  useEffect(() => {
    if (!isArticlesLoading && isOpen) {
      handleSearch(INITIAL_SEARCH_TERM)
    }
  }, [isArticlesLoading, handleSearch, isOpen])

  const isLoadingState = isLoading || isArticlesLoading
  const isEmptyState = !isLoadingState && results.length === 0

  return (
    <OverlayDrawer open={isOpen} onClose={handleClose} width="690px">
      <OverlayDrawer.Header title="Search for Articles" />
      <OverlayDrawer.Body className={classes.body}>
        <Box flex={0} px={3} py={2}>
          <SearchInput
            debounceTime={500}
            isLoading={isLoadingState}
            onChange={handleSearchChange}
            placeholder="Search for a subject or paste a link"
            fullWidth
          />
        </Box>
        <Box flex={1} className={classes.results} px={3}>
          <SearchArticleImageCacheProvider>
            {isLoadingState ? (
              <LoadingContainer />
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
      <OverlayDrawer.Footer rowReverse>
        <Button
          disabled={isLoadingState || selected.length === 0}
          color="primary"
          variant="contained"
          onClick={handleInsert}
        >
          Done
        </Button>
      </OverlayDrawer.Footer>
    </OverlayDrawer>
  )
}

export default SearchArticleDrawer
