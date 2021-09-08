import { useState } from 'react'

import {
  Box,
  CircularProgress,
  Typography,
  Divider,
  Button,
  useTheme
} from '@material-ui/core'
import { useDropzone } from 'dropzone'

import { UploadableImageTabProps } from '../../types'

export default function Upload({ onSelectFile }: UploadableImageTabProps) {
  const theme = useTheme()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      return
    }

    try {
      setIsLoading(true)
      await onSelectFile(acceptedFiles[0])
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: 'image/*'
  })

  if (isLoading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        width="100%"
      >
        <div>
          <CircularProgress />
        </div>
      </Box>
    )
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      width="100%"
      bgcolor={
        isDragActive ? theme.palette.grey[400] : theme.palette.common.white
      }
      {...getRootProps()}
      css={{}}
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
