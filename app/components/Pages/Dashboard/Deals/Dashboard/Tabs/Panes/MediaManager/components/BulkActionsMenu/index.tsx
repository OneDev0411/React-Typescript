import React, { useContext } from 'react'
import { Typography, Box, Button, Checkbox, Link } from '@material-ui/core'

import { useStyles } from '../../styles'
import { MediaManagerAPI } from '../../context'
import { IMediaItem } from '../../types'

interface Props {
  mediaGallery: IMediaItem[]
}

export default function BulkActionsMenu({ mediaGallery }: Props) {
  const classes = useStyles()
  const selectedGalleryItems = mediaGallery.filter(media => media.selected)
  const uploadedGalleryItems = mediaGallery.filter(media => !media.isNew)
  const api = useContext(MediaManagerAPI)

  const handleSelectAll = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    api && api.toggleGallerySelection(true)
  }
  const handleSelectNone = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    api && api.toggleGallerySelection(false)
  }

  return (
    <Box
      display="flex"
      width={1}
      className={classes.bulkActionsMenu}
      p={2}
      borderColor="#d4d4d4"
    >
      <Box flexGrow={1}>
        <Checkbox
          color="primary"
          onChange={handleSelectNone}
          checked={selectedGalleryItems.length === uploadedGalleryItems.length}
          indeterminate={
            selectedGalleryItems.length > 0 &&
            selectedGalleryItems.length !== uploadedGalleryItems.length
          }
        />
        <Typography display="inline" className={classes.bold}>
          {selectedGalleryItems.length} Photos selected
        </Typography>

        {selectedGalleryItems.length !== uploadedGalleryItems.length && (
          <>
            <Typography display="inline" variant="body2" color="textSecondary">
              &nbsp;&#9679;&nbsp;
            </Typography>
            <Link href="#" onClick={handleSelectAll}>
              Select all {uploadedGalleryItems.length} photos
            </Link>
          </>
        )}
      </Box>
      <Box
        flexGrow={1}
        display="flex"
        flexDirection="row-reverse"
        className={classes.actionButtons}
      >
        <Button
          variant="outlined"
          disableElevation
          className={classes.lowerCaseButton}
        >
          Download {selectedGalleryItems.length} photo(s)
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          disableElevation
          className={classes.lowerCaseButton}
        >
          Delete {selectedGalleryItems.length} photo(s)
        </Button>
      </Box>
    </Box>
  )
}
