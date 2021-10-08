import { Grid, makeStyles } from '@material-ui/core'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList } from 'react-window'

import { CARD_HEIGHT } from '../SearchResultCard'

import SearchArticleItem from './SearchArticleItem'
import { RSSArticleMetadata } from './types'

const ITEMS_PER_ROW = 3

const useStyles = makeStyles(
  theme => ({
    row: { paddingRight: theme.spacing(3) }
  }),
  { name: 'SearchArticleResults' }
)

interface SearchArticleResultsProps {
  results: RSSArticleMetadata[]
  selected: RSSArticleMetadata[]
  onSelect: (article: RSSArticleMetadata) => void
}

function SearchArticleResults({
  results,
  selected,
  onSelect
}: SearchArticleResultsProps) {
  const classes = useStyles()

  // Create a map using the selected urls so it can check the selected items easily
  const selectedUrls = selected.reduce<Record<string, true>>(
    (acc, article) => ({ ...acc, [article.url]: true }),
    {}
  )

  return (
    <AutoSizer>
      {({ width, height }) => {
        const rowCount = Math.ceil(results.length / ITEMS_PER_ROW)

        return (
          <FixedSizeList
            width={width}
            height={height}
            itemCount={rowCount}
            overscanCount={ITEMS_PER_ROW}
            itemSize={CARD_HEIGHT}
          >
            {({ index, style }) => {
              const fromIndex = index * ITEMS_PER_ROW

              const toIndex = Math.min(
                fromIndex + ITEMS_PER_ROW,
                results.length
              )

              return (
                <div className={classes.row} style={style}>
                  <Grid container>
                    {results.slice(fromIndex, toIndex).map(article => (
                      <Grid item key={article.url} xs={12} sm={4}>
                        <SearchArticleItem
                          article={article}
                          isSelected={selectedUrls[article.url]}
                          onSelect={() => onSelect(article)}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </div>
              )
            }}
          </FixedSizeList>
        )
      }}
    </AutoSizer>
  )
}

export default SearchArticleResults
