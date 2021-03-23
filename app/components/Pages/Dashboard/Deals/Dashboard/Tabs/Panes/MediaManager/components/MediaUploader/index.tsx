import React, { useState, useRef, useImperativeHandle } from 'react'
import { Box, Typography } from '@material-ui/core'
// @ts-ignore
import Dropzone from 'react-dropzone-rechat'

import acceptedDocuments from '../../constants/acceptedDocuments'
import { useStyles } from '../../styles'

interface Props {
  children: React.ReactChild
  onDrop(files: any, rejectedFiles: any): void
  disableClick: boolean
  dropzoneRef?: React.RefObject<DropzoneRef>
}

export interface DropzoneRef {
  open(): void
}
const Uploader = (props: Props) => {
  const classes = useStyles()
  const handlerRef = useRef<DropzoneRef | null>(null)
  const [dragzoneActive, setDragZoneActive] = useState<boolean>(false)
  const { onDrop, disableClick, children } = props
  const handleOnDrop = (files: any[], rejectedFiles: any[]) => {
    setDragZoneActive(false)
    onDrop(files, rejectedFiles)
  }

  useImperativeHandle(props.dropzoneRef, () => ({
    open: () => handlerRef && handlerRef.current && handlerRef.current.open()
  }))

  return (
    <Dropzone
      style={{ width: '100%' }}
      disableClick={disableClick}
      onDrop={handleOnDrop}
      onDragEnter={() => setDragZoneActive(true)}
      onDragLeave={() => setDragZoneActive(false)}
      accept={acceptedDocuments}
      ref={handlerRef}
      multiple
    >
      {dragzoneActive && (
        <Box className={classes.uploadPlaceholder}>
          <Box className={classes.uploadArea}>
            <Typography variant="h4" className="title">
              Drop to upload
            </Typography>
            <Typography className="desc">
              You can drag and drop file with extensions: {acceptedDocuments}
            </Typography>
          </Box>
        </Box>
      )}
      {children}
    </Dropzone>
  )
}
export default React.forwardRef(
  (props: Props, ref: React.RefObject<DropzoneRef>) => (
    <Uploader {...props} dropzoneRef={ref} />
  )
)
