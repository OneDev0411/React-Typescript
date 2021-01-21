import React from 'react'
import { useDropzone } from 'dropzone'
import { Box, Typography, Divider, Button, useTheme } from '@material-ui/core'

import { UploadableImageTabProps } from '../../types'

export default function Upload({ onSelectFile }: UploadableImageTabProps) {
  const theme = useTheme()

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      return
    }

    onSelectFile(acceptedFiles[0])
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: 'image/*'
  })

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100%"
      width="100%"
      bgcolor={
        isDragActive ? theme.palette.grey[400] : theme.palette.common.white
      }
      {...{ ...getRootProps(), css: {} }}
    >
      <input {...getInputProps()} />

      <Box mb={4}>
        <img src="/static/icons/gif-png-jpg.svg" alt="gif, png or jpg" />
      </Box>

      {isDragActive ? (
        <Typography variant="h6">Drop your photo here to upload</Typography>
      ) : (
        <Typography variant="h6">Drag your photo here to upload</Typography>
      )}

      <Box display="flex" alignItems="center" padding={1}>
        <Divider />

        <Box py={2}>
          <Typography variant="body1">OR</Typography>
        </Box>

        <Divider />
      </Box>

      <Button variant="contained" color="secondary" disabled={isDragActive}>
        Choose from files
      </Button>
    </Box>
  )
}
