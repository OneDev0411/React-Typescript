import { Grid } from '@material-ui/core'

import SearchVideoItem from './SearchVideoItem'
import { SearchVideoResult } from './types'

interface SearchVideoResultsProps {
  videos: SearchVideoResult[]
  selected: Nullable<SearchVideoResult>
  onSelect: (video: SearchVideoResult) => void
}

function SearchVideoResults({
  videos,
  selected,
  onSelect
}: SearchVideoResultsProps) {
  return (
    <Grid container spacing={2}>
      {videos.map(video => (
        <Grid item key={video.url} xs={6}>
          <SearchVideoItem
            video={video}
            selected={video.url === selected?.url}
            onClick={() => onSelect(video)}
          />
        </Grid>
      ))}
    </Grid>
  )
}

export default SearchVideoResults
