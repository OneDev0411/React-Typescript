import { useState } from 'react'

import { Grid, LinearProgress, makeStyles } from '@material-ui/core'

import { readFileAsDataUrl } from '@app/utils/file-utils/read-file-as-data-url'

import { SearchResultCard } from '../SearchResultCard'

import { createGalleryVideoObject } from './helpers'
import { SearchVideoResult } from './types'
import UploadWrapper from './UploadWrapper'

const useStyles = makeStyles(
  theme => ({
    icon: {
      width: theme.spacing(2),
      height: 'auto'
    }
  }),
  { name: 'SearchVideoResults' }
)

interface SearchVideoResultsProps {
  videos: SearchVideoResult[]
  onSelect: (video: SearchVideoResult) => void
  shouldShowUploader: boolean
  templateType?: IMarketingTemplateType
  medium?: IMarketingTemplateMedium
}

function SearchVideoResults({
  videos,
  onSelect,
  shouldShowUploader,
  templateType = 'Agent',
  medium = 'Email'
}: SearchVideoResultsProps) {
  const classes = useStyles()

  const [preview, setPreview] = useState<Nullable<string>>(null)

  const [newUploadedAssets, setNewUploadedAssets] = useState<
    SearchVideoResult[]
  >([])

  const onStart = async (file: File) => {
    const url = await readFileAsDataUrl(file)

    setPreview(url)
  }
  const onDoneUploading = (brandAsset: IBrandAsset) => {
    setPreview(null)

    setNewUploadedAssets([
      createGalleryVideoObject(brandAsset),
      ...newUploadedAssets
    ])
  }
  const onErrorUploading = () => {}

  return (
    <Grid container>
      {shouldShowUploader && (
        <>
          <Grid item xs={4}>
            <UploadWrapper
              onStart={onStart}
              onDone={onDoneUploading}
              onError={onErrorUploading}
              medium={medium}
              templateType={templateType}
            >
              {({ isDragActive, uploadProgress, open }) => (
                <>
                  {uploadProgress === null ? (
                    <button type="button" onClick={open}>
                      Upload
                    </button>
                  ) : (
                    <LinearProgress
                      value={uploadProgress}
                      variant="determinate"
                    />
                  )}
                </>
              )}
            </UploadWrapper>
          </Grid>
          {preview && (
            <Grid item xs={4}>
              <video src={preview} autoPlay={false} />
            </Grid>
          )}
        </>
      )}

      {[...newUploadedAssets, ...videos].map(video => (
        <Grid item key={video.url} xs={4}>
          <SearchResultCard
            title={video.title}
            link={video.playerUrl ?? video.url}
            imageUrl={video.thumbnail ?? video.url}
            imageAlt={video.publisher}
            imageAspect={0.56} // 9/16 aspect ratio
            overline={video.publisher}
            overlineDate={video.publishedAt}
            overlineIcon={video.sourceIcon}
            onSelect={() => onSelect(video)}
            classes={{ overlineIcon: classes.icon }}
          />
        </Grid>
      ))}
    </Grid>
  )
}

export default SearchVideoResults
