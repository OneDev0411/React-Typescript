import { memo, useMemo, useState } from 'react'

import { alpha, Box, Grid, makeStyles, Typography } from '@material-ui/core'

import { readFileAsDataUrl } from '@app/utils/file-utils/read-file-as-data-url'

import { CARD_IMAGE_RATIO } from '../SearchResultCard'
import SearchResultUploadingCard from '../SearchResultCard/SearchResultUploadingCard'

import { createGalleryVideoObject } from './helpers'
import SearchVideoEmptyState from './SearchVideoEmptyState'
import SearchVideoResults from './SearchVideoResults'
import SearchVideoUploadButton from './SearchVideoUploadButton'
import { SearchVideoResult, Video } from './types'
import UploadWrapper from './UploadWrapper'

const useStyles = makeStyles(
  theme => ({
    result: {
      overflowX: 'hidden',
      overflowY: 'auto'
    },
    container: {
      position: 'relative',
      height: '100%'
    },
    dragged: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      paddingTop: theme.spacing(30),
      alignItems: 'flex-start',
      justifyContent: 'center',
      backgroundColor: alpha(theme.palette.grey[200], 0.95),
      border: `1px dashed ${theme.palette.secondary.main}`,
      borderRadius: theme.spacing(0.5),
      zIndex: 3,
      cursor: 'copy'
    }
  }),
  { name: 'VideoList' }
)

interface Props {
  videos: SearchVideoResult[]
  onSelect: (video: Video) => void
  shouldShowUploader: boolean
}

function VideoList({ videos, onSelect, shouldShowUploader = false }: Props) {
  const classes = useStyles()

  const [uploadingVideoPreview, setUploadingVideoPreview] =
    useState<Nullable<string>>(null)

  const [justUploadedVideos, setJustUploadedVideos] = useState<
    SearchVideoResult[]
  >([])

  const onStartUploading = async (file: File) => {
    const url = await readFileAsDataUrl(file)

    setUploadingVideoPreview(url)
  }

  const onDoneUploading = (brandAsset: IBrandAsset) => {
    setUploadingVideoPreview(null)

    setJustUploadedVideos([
      createGalleryVideoObject(brandAsset),
      ...justUploadedVideos
    ])
  }

  const onErrorUploading = () => {
    setUploadingVideoPreview(null)
  }

  const combinedVideos = useMemo(
    () => [...justUploadedVideos, ...videos.reverse()], // reverse to show the latest videos first
    [justUploadedVideos, videos]
  )

  const isUploadingState = uploadingVideoPreview !== null
  const isEmptyState = combinedVideos.length === 0 && !isUploadingState

  return (
    <>
      <Box flex={1} className={classes.result} py={2} px={3}>
        <UploadWrapper
          disabled={!shouldShowUploader}
          onStart={onStartUploading}
          onDone={onDoneUploading}
          onError={onErrorUploading}
        >
          {({ isDragActive, uploadProgress, open }) => (
            <Grid className={classes.container} container>
              {isDragActive && (
                <div className={classes.dragged}>
                  <Typography variant="h4" color="secondary">
                    Drop here to upload
                  </Typography>
                </div>
              )}
              {isEmptyState ? (
                <SearchVideoEmptyState
                  text="You don’t have anything in your gallery yet,
                Upload your assets right here!"
                  shouldShowUploader={shouldShowUploader}
                  onClickUpload={open}
                />
              ) : (
                <>
                  {shouldShowUploader && (
                    <>
                      <Grid item xs={4}>
                        <SearchVideoUploadButton
                          disabled={uploadProgress !== null}
                          onClick={open}
                        />
                      </Grid>

                      {isUploadingState && uploadProgress !== null && (
                        <Grid item xs={4}>
                          <SearchResultUploadingCard
                            title="Uploading..."
                            progressPercentage={uploadProgress}
                            imageUrl={uploadingVideoPreview}
                            imageAspect={CARD_IMAGE_RATIO}
                          />
                        </Grid>
                      )}
                    </>
                  )}
                  <SearchVideoResults
                    videos={combinedVideos}
                    onSelect={onSelect}
                  />
                </>
              )}
            </Grid>
          )}
        </UploadWrapper>
      </Box>
    </>
  )
}

export default memo(VideoList)
