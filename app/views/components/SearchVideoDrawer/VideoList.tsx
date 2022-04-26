import { memo } from 'react'

import { Box, makeStyles } from '@material-ui/core'

import SearchVideoResults from './SearchVideoResults'
import { SearchVideoResult, Video } from './types'

const useStyles = makeStyles(
  theme => ({
    result: {
      overflowX: 'hidden',
      overflowY: 'auto'
    }
  }),
  { name: 'Videobolt' }
)

interface VideoboltProps {
  videos: SearchVideoResult[]
  onSelect: (video: Video) => void
}

function VideoList({ videos, onSelect }: VideoboltProps) {
  const classes = useStyles()

  return (
    <>
      <Box flex={1} className={classes.result} py={2} px={3}>
        <SearchVideoResults videos={videos} onSelect={onSelect} />
      </Box>
    </>
  )
}

export default memo(VideoList)
