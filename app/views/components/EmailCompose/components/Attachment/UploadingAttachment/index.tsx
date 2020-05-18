import * as React from 'react'
import { ComponentProps } from 'react'
import {
  Box,
  createStyles,
  LinearProgress,
  makeStyles,
  Theme
} from '@material-ui/core'

import { IUploadingAttachment } from '../../../types'
import { useUploadRequest } from './use-upload-request'

import { Attachment } from '..'

type AttachmentProps = ComponentProps<typeof Attachment>

type BaseProps = Omit<AttachmentProps, 'children'> &
  Required<Pick<AttachmentProps, 'onDelete'>>

interface Props extends BaseProps {
  attachment: IUploadingAttachment
  onFinish: (file: IFile) => void
  onError: (error: any) => void
}

const useUploadingAttachmentStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      progress: {
        marginRight: `${theme.spacing(1)}px`,
        width: '7rem'
      }
    }),
  { name: 'UploadingAttachment' }
)

export function UploadingAttachment({
  attachment,
  onFinish,
  onError,
  ...props
}: Props) {
  const { progress } = useUploadRequest({
    request: attachment.request,
    onFinish,
    onError
  })
  const classes = useUploadingAttachmentStyles()

  const cancel = () => {
    attachment.request.abort()
    props.onDelete()
  }

  return (
    <Attachment {...props} onDelete={cancel}>
      <Box display="flex" alignItems="center">
        <Box flexGrow={1}>{attachment.file.name}</Box>
        {progress !== null && progress <= 100 && (
          <LinearProgress
            className={classes.progress}
            variant="determinate"
            value={progress}
          />
        )}
      </Box>
    </Attachment>
  )
}
