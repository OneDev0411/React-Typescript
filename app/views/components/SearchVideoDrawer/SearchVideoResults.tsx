import { Grid, makeStyles } from '@material-ui/core'

import { SearchResultCard } from '../SearchResultCard'

import { SearchVideoResult } from './types'

const useStyles = makeStyles(
  theme => ({
    icon: {
      width: theme.spacing(2),
      height: 'auto'
    }
  }),
  { name: 'SearchVideoResults' }
)

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
  const classes = useStyles()

  return (
    <Grid container>
      {videos.map(video => (
        <Grid item key={video.url} xs={4}>
          <SearchResultCard
            title={video.title}
            link={video.url}
            imageUrl={video.thumbnail}
            imageAlt={video.publisher}
            imageAspect={0.56} // 9/16 aspect ratio
            overline={video.publisher}
            overlineDate={video.publishedAt}
            overlineIcon={video.sourceIcon}
            isSelected={selected?.url === video.url}
            onSelect={() => onSelect(video)}
            classes={{ overlineIcon: classes.icon }}
          />
        </Grid>
      ))}
    </Grid>
  )
}

export default SearchVideoResults
