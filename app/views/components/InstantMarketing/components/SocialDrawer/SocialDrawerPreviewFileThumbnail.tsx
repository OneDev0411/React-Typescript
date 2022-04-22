import { makeStyles } from '@material-ui/core'

import { getFileType } from '@app/utils/file-utils/get-file-type'
import { PdfThumbnail } from 'components/PdfThumbnail'

const useStyles = makeStyles(
  theme => ({
    preview: {
      maxHeight: '90%',
      maxWidth: '100%',
      boxShadow: theme.shadows[5]
    }
  }),
  { name: 'SocialDrawerPreviewFileThumbnail' }
)

interface SocialDrawerPreviewFileThumbnailProps {
  instance: IMarketingTemplateInstance | IBrandAsset
}

function SocialDrawerPreviewFileThumbnail({
  instance
}: SocialDrawerPreviewFileThumbnailProps) {
  const classes = useStyles()
  const fileType = getFileType(instance.file)

  if (fileType === 'pdf') {
    return (
      <PdfThumbnail
        url={instance.file.url}
        style={{
          height: '100%'
        }}
      />
    )
  }

  if (fileType === 'image') {
    return <img className={classes.preview} src={instance.file.url} alt="" />
  }

  return (
    <video
      className={classes.preview}
      muted
      autoPlay
      loop
      src={instance.file.url}
    />
  )
}

export default SocialDrawerPreviewFileThumbnail
