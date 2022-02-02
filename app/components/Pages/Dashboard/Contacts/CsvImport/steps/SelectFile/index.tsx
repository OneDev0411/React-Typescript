import { useCallback } from 'react'

import { Box, Button, Theme, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { useDropzone } from 'dropzone'

import { Owner } from '../../components/Owner'

const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {},
    dnd: {
      width: '80%',
      border: `1px dashed ${theme.palette.grey[400]}`,
      backgroundColor: theme.palette.grey[100],
      padding: theme.spacing(10),
      borderRadius: theme.shape.borderRadius
    }
  }),
  {
    name: 'ImportCsv-SelectFile'
  }
)

interface Props {
  onSelectFile: (file: File) => void
  onChangeOwner: (user: IUser) => void
}

export function SelectFile({ onSelectFile, onChangeOwner }: Props) {
  const classes = useStyles()

  const onDrop = useCallback(
    acceptedFiles => onSelectFile(acceptedFiles[0]),
    [onSelectFile]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ['.csv'],
    multiple: false
  })

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      className={classes.root}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        className={classes.dnd}
        {...getRootProps()}
      >
        <input {...getInputProps()} />

        <Typography variant="body1">
          {isDragActive
            ? 'Drop the files here ...'
            : 'Drag and drop some files here, or click to select files'}
        </Typography>

        <Box my={2}>
          <Typography variant="body2">or</Typography>
        </Box>

        <Button color="secondary">Select a file</Button>
      </Box>

      <Box my={2}>
        <Owner onSelect={onChangeOwner} />
      </Box>
    </Box>
  )
}
