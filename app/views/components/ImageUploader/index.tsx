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
import { makeStyles } from '@material-ui/styles'
import { useDropzone, DropzoneOptions } from 'dropzone'

import { EditorDialog } from 'components/ImageEditor'

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
      backgroundColor: theme.palette.grey['500']
    }
  }),
  {
    name: 'ImageUploader'
  }
)

interface Props {
  children: (props: { openDialog: () => void }) => React.ReactNode
  options?: DropzoneOptions
  disableEditor?: boolean
  editorOptions?: {
    dimensions?: [number, number]
  }
  onSelectImage: (file: File) => void
}

export function ImageUploader({
  options = {},
  editorOptions = {},
  disableEditor = false,
  onSelectImage,
  children
}: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const onDropFiles = (files: File[]) => {
    if (disableEditor) {
      onSelectImage(files[0])

      return
    }

    setFile(files[0])
  }

  const handleSave = (imageUrl: File) => {
    setFile(null)
    setIsOpen(false)
    onSelectImage(imageUrl)
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
            {...{ ...getRootProps(), css: {} }}
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

      {file && (
        <EditorDialog
          file={file}
          dimensions={editorOptions.dimensions}
          onClose={() => setFile(null)}
          onSave={handleSave}
        />
      )}
    </>
  )
}
