import { Grid } from '@material-ui/core'

import SearchVideoItem from './SearchVideoItem'
import { SearchVideoResult } from './types'

interface SearchVideoResultsProps {
  videos: SearchVideoResult[]
  onSelect: (video: SearchVideoResult) => void
}

function SearchVideoResults({ videos, onSelect }: SearchVideoResultsProps) {
  return (
    <Grid container spacing={2}>
      {videos.map(video => (
        <Grid item key={video.url} xs={6}>
          <SearchVideoItem video={video} onClick={() => onSelect(video)} />
        </Grid>
      ))}
    </Grid>
  )
}

export default SearchVideoResults
