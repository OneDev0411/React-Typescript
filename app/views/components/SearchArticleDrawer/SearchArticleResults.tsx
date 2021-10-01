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
  // Create a map using the selected urls so it can check the selected items easily
  const selectedUrls = selected.reduce<Record<string, true>>(
    (acc, article) => ({ ...acc, [article.url]: true }),
    {}
  )

  return (
    <Grid container>
      {results.map(article => (
        <Grid item key={article.url} xs={12} sm={4}>
          <SearchArticleItem
            article={article}
            isSelected={selectedUrls[article.url]}
            onSelect={() => onSelect(article)}
          />
        </Grid>
      ))}
    </Grid>
  )
}

export default SearchArticleResults
