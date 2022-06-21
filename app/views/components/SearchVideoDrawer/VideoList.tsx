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

interface Props {
  videos: SearchVideoResult[]
  onSelect: (video: Video) => void
  shouldShowUploader?: boolean
}

function VideoList({ videos, onSelect, shouldShowUploader = false }: Props) {
  const classes = useStyles()

  return (
    <>
      <Box flex={1} className={classes.result} py={2} px={3}>
        <SearchVideoResults
          shouldShowUploader={shouldShowUploader}
          videos={videos}
          onSelect={onSelect}
        />
      </Box>
    </>
  )
}

export default memo(VideoList)
