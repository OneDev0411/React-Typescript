import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Theme,
  Box,
  Typography,
  Divider,
  Button
} from '@material-ui/core'
import { useDropzone, DropzoneOptions } from 'dropzone'
import { makeStyles } from '@material-ui/styles'

import { Editor } from 'components/ImageEditor'

interface ThemeProps {
  isDragActive: boolean
}

const useStyles = makeStyles(
  (theme: Theme) => ({
    dialogContent: ({ isDragActive }: ThemeProps) => ({
      padding: 0,
      backgroundColor: theme.palette.grey[isDragActive ? 200 : 100]
    }),
    container: {
      padding: theme.spacing(15, 30)
    },
    textOr: {
      opacity: 0.5,
      margin: theme.spacing(2, 0)
    },
    dropzone: {
      width: '100%',
      height: '100%',
      backgroundColor: '#f2f2f2'
    }
  }),
  {
    name: 'ImageUploader'
  }
)

interface Props {
  children: (props: { openDialog: () => void }) => React.ReactNode
  options: DropzoneOptions
  disablePhotoEditor: boolean
  onDrop: DropzoneOptions['onDrop']
  onSelectFile: (file: IBlobFile) => void
}

export function ImageUploader({
  options,
  disablePhotoEditor = false,
  onSelectFile,
  children
}: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [file, setFile] = useState<IBlobFile | null>(null)

  const onDropFiles = (files: IBlobFile[]) => {
    if (disablePhotoEditor) {
      onSelectFile(files[0])

      return
    }

    setFile(files[0])
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropFiles,
    minSize: 0,
    maxSize: Infinity,
    accept: 'image/*',
    ...options,
    multiple: false // always false
  })

  const classes = useStyles({ isDragActive })

  return (
    <>
      {children({
        openDialog: () => setIsOpen(true)
      })}

      <Dialog
        open={isOpen && !file}
        maxWidth="md"
        onClose={() => setIsOpen(false)}
      >
        <DialogTitle>Upload Photo</DialogTitle>
        <DialogContent
          classes={{
            root: classes.dialogContent
          }}
        >
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            textAlign="center"
            className={classes.container}
            {...getRootProps()}
          >
            <input {...getInputProps()} />

            <Box mb={4}>
              <img src="/static/icons/gif-png-jpg.svg" alt="gif, png or jpg" />
            </Box>

            <Typography variant="h6">Drag your photo here to upload</Typography>

            <Box display="flex" alignItems="center" padding={1}>
              <Divider />

              <Typography variant="body1" className={classes.textOr}>
                OR
              </Typography>

              <Divider />
            </Box>

            <Button
              variant="contained"
              color="secondary"
              disabled={isDragActive}
            >
              Choose from files
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {file && <Editor file={file} />}
    </>
  )
}
