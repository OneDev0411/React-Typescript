import React, { useState, ReactChild } from 'react'
import { Box, Typography } from '@material-ui/core'
// @ts-ignore
import Dropzone from 'react-dropzone'

import { useStyles } from '../../styles'

interface Props {
  children: ReactChild
  onDrop(files: any, rejectedFiles: any): void
  disableClick: boolean
}

export default function Uploader({ onDrop, disableClick, children }: Props) {
  const classes = useStyles()
  const [dragzoneActive, setDragZoneActive] = useState<boolean>(false)

  const handleOnDrop = (files: any[], rejectedFiles: any[]) => {
    setDragZoneActive(false)
    onDrop(files, rejectedFiles)
  }

  return (
    <Dropzone
      style={{ width: '100%' }}
      disableClick={disableClick}
      onDrop={handleOnDrop}
      onDragEnter={() => setDragZoneActive(true)}
      onDragLeave={() => setDragZoneActive(false)}
      multiple
    >
      {dragzoneActive && (
        <Box className={classes.uploadPlaceholder}>
          <Box className={classes.uploadArea}>
            <Typography variant="h4" className="title">
              Drop to upload
            </Typography>
            <Typography className="desc">
              You can drag and drop file with fomrat: JPG, PNG and TIFF
            </Typography>
          </Box>
        </Box>
      )}
      {children}
    </Dropzone>
  )
}
