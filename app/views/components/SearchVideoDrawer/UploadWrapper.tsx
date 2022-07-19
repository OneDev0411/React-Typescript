import { ReactNode, useCallback, useState } from 'react'

import { Grid } from '@material-ui/core'
import { useDropzone, FileRejection } from 'dropzone'

import { useActiveBrandId } from '@app/hooks/brand'
import useNotify from '@app/hooks/use-notify'
import { uploadBrandAsset } from '@app/models/brand/upload-asset'

interface RenderProps {
  isDragActive: boolean
  uploadProgress: Nullable<number>
  open: () => void
}

interface Props {
  onStart: (file: File) => void
  onDone: (brandAsset: IBrandAsset) => void
  onError: () => void
  noDrag?: boolean
  disabled?: boolean
  children: (renderProps: RenderProps) => ReactNode
}

export default function UploadWrapper({
  onStart,
  onDone,
  onError,
  noDrag = false,
  disabled = false,
  children
}: Props) {
  const notify = useNotify()

  const activeBrandId = useActiveBrandId()

  const [uploadProgress, setUploadProgress] = useState<Nullable<number>>(null)

  const handleUploadAsset = useCallback(
    async (file: File) => {
      onStart(file)
      setUploadProgress(0)

      try {
        const uploadedAsset = await uploadBrandAsset(
          [activeBrandId],
          file,
          {
            label: file.name.split('.')[0] // get file name without extension
          },
          progressEvent => {
            if (
              progressEvent.direction !== 'upload' ||
              !progressEvent.percent
            ) {
              return
            }

            setUploadProgress(progressEvent.percent)
          }
        )

        if (uploadedAsset[0]) {
          onDone(uploadedAsset[0])
        }
      } catch (error) {
        console.error(error)
        notify({
          status: 'error',
          message:
            'Something went wrong while uploading your assets. Please try again.'
        })
        onError()
      } finally {
        setUploadProgress(null)
      }
    },
    [activeBrandId, notify, onDone, onError, onStart]
  )

  const onDrop = useCallback(
    async (acceptedFiles: File[], rejections: FileRejection[]) => {
      // All files are invalid
      if (acceptedFiles.length === 0 && rejections.length > 0) {
        notify({
          status: 'error',
          message: 'Only mp4 videos are allowed.'
        })

        return
      }

      // Some files are invalid
      if (rejections.length > 0) {
        notify({
          status: 'warning',
          message: 'file rejected. Only mp4 videos are allowed.'
        })
      }

      handleUploadAsset(acceptedFiles[0])
    },
    [handleUploadAsset, notify]
  )

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    multiple: false,
    noClick: true,
    noDrag,
    disabled,
    accept: ['video/mp4']
  })

  return (
    <Grid container {...getRootProps()}>
      {uploadProgress === null && (
        <input disabled={disabled} {...getInputProps()} />
      )}

      {children({ isDragActive, open, uploadProgress })}
    </Grid>
  )
}
