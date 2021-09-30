import { Grid } from '@material-ui/core'

import SearchArticleItem from './SearchArticleItem'
import { RSSArticleMetadata } from './types'

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
  return (
    <Grid container>
      {results.map(article => (
        <Grid item key={article.url} xs={12} sm={4}>
          <SearchArticleItem
            article={article}
            isSelected={selected.includes(article)}
            onSelect={() => onSelect(article)}
          />
        </Grid>
      ))}
    </Grid>
  )
}

export default SearchArticleResults
