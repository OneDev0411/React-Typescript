import { memo } from 'react'

import {
  Grid,
  Box,
  Typography,
  Divider,
  Button,
  Chip,
  CircularProgress,
  Theme,
  makeStyles,
  useTheme
} from '@material-ui/core'
import { useDropzone } from 'dropzone'
import { useDispatch } from 'react-redux'

import { useActiveBrandId } from '@app/hooks/brand/use-active-brand-id'
import { confirmation } from '@app/store_actions/confirmation'
import Masonry from '@app/views/components/Masonry'

import { isGifImage } from '../../helpers'
import ImageThumbnail from '../../ImageThumbnail'
import Loading from '../../Loading'
import NoResults from '../../NoResults'
import { SearchableImageTabProps } from '../../types'

import { DEFAULT_ASSET_LABEL } from './constants'
import { isImageAsset } from './helpers'
import { useTeamLibrary } from './hooks'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      '&:focus': {
        outline: 'none'
      }
    },
    tagsContainer: {
      padding: theme.spacing(0, 2)
    },
    uploadContainer: {
      textAlign: 'center',
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      cursor: 'pointer',
      minHeight: 200,
      '&:hover': {
        backgroundColor: theme.palette.grey[200]
      }
    }
  }),
  {
    name: 'ImageSelectDialogTeamLibrary'
  }
)

function TeamLibrary({
  query,
  setQuery,
  onSelect,
  onEdit
}: SearchableImageTabProps) {
  const classes = useStyles()
  const dispatch = useDispatch()
  const activeBrandId = useActiveBrandId()
  const {
    results,
    labels,
    isLoading,
    isUploading,
    hasDeleteAccess,
    deleteAsset,
    uploadAsset
  } = useTeamLibrary(activeBrandId, query, isImageAsset)

  const theme = useTheme()

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      return
    }

    dispatch(
      confirmation({
        description: 'Please add a label for this photo.',
        needsUserEntry: true,
        multilineEntry: false,
        inputPlaceholder: 'Photo label',
        inputStyle: {
          height: '3rem'
        },
        confirmLabel: 'Upload & Save',
        onConfirm: (label: string) => {
          const file = acceptedFiles[0]

          const trimmedLabel = label.trim()
          const finalLabel =
            trimmedLabel === '' ? DEFAULT_ASSET_LABEL : trimmedLabel

          uploadAsset(file, finalLabel)
        }
      })
    )
  }

  const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    multiple: false,
    accept: 'image/*'
  })

  const handleDelete = (asset: IBrandAsset) => {
    dispatch(
      confirmation({
        message: 'Delete photo',
        description: 'Are your sure about deleting this photo?',
        confirmLabel: 'Yes, I do',
        appearance: 'danger',
        onConfirm: () => {
          deleteAsset(asset.id)
        }
      })
    )
  }

  const handleChipClick = (label: string) => {
    if (!setQuery) {
      return
    }

    // A simple toggle behavior for labels
    const nextQuery = label === query ? '' : label

    setQuery(nextQuery)
  }

  const handleUploadClick = () => {
    if (isUploading) {
      return
    }

    open()
  }

  const renderLabels = () => {
    return (
      <Grid
        container
        item
        direction="row"
        spacing={1}
        className={classes.tagsContainer}
      >
        {labels.map(label => (
          <Grid key={label} item>
            <Chip
              variant="outlined"
              color={query === label ? 'primary' : 'default'}
              label={label}
              onClick={() => handleChipClick(label)}
            />
          </Grid>
        ))}
      </Grid>
    )
  }

  if (isLoading) {
    return <Loading />
  }

  if (query && results.length === 0) {
    return (
      <NoResults>
        <Box py={2}>{renderLabels()}</Box>
      </NoResults>
    )
  }

  return (
    <Box
      minHeight="100%"
      width="100%"
      className={classes.container}
      bgcolor={
        isDragActive ? theme.palette.grey[400] : theme.palette.common.white
      }
      {...{ ...getRootProps(), css: {} }}
    >
      {results.length === 0 && (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          height="100%"
          width="100%"
          onClick={handleUploadClick}
        >
          <input {...getInputProps()} />

          <Box mb={4}>
            <img src="/static/icons/gif-png-jpg.svg" alt="gif, png or jpg" />
          </Box>

          {isDragActive ? (
            <Typography variant="h6">
              Drop your photo here to upload it to your team library
            </Typography>
          ) : (
            <Typography variant="h6">
              Drag your photo here to upload it to your team library
            </Typography>
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
      )}
      {results.length > 0 && (
        <Grid container direction="column">
          {renderLabels()}
          <Grid container item>
            <Masonry>
              <Box
                className={classes.uploadContainer}
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                m={1}
                onClick={handleUploadClick}
              >
                {isUploading ? (
                  <>
                    <Typography variant="body2">Uploading</Typography>
                    <Box py={1}>
                      <CircularProgress />
                    </Box>
                  </>
                ) : (
                  <>
                    <input {...getInputProps()} />

                    <Typography variant="body2">
                      Click Here To Upload
                    </Typography>
                    <Box py={1}>
                      <Button variant="contained" color="secondary">
                        Upload
                      </Button>
                    </Box>
                  </>
                )}
              </Box>
              {results.map(item => {
                const imageUrl = item.file.url
                const canDelete = hasDeleteAccess(item.id)

                return (
                  <ImageThumbnail
                    key={item.id}
                    onEditClick={
                      onEdit && !isGifImage(imageUrl)
                        ? () => onEdit(`/api/utils/cors/${btoa(imageUrl)}`)
                        : undefined
                    }
                    onDeleteClick={
                      canDelete ? () => handleDelete(item) : undefined
                    }
                    onClick={() => onSelect(imageUrl)}
                    src={imageUrl}
                    alt={item.label}
                  />
                )
              })}
            </Masonry>
          </Grid>
        </Grid>
      )}
    </Box>
  )
}

export default memo(TeamLibrary)
