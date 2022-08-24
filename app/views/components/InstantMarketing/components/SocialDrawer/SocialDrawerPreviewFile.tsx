import { CircularProgress, makeStyles, Typography } from '@material-ui/core'
import classNames from 'classnames'

import SocialDrawerPreviewFileThumbnail from './SocialDrawerPreviewFileThumbnail'

const useStyles = makeStyles(
  theme => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: 256,
      backgroundColor: theme.palette.grey[100],
      padding: theme.spacing(0, 3),
      textAlign: 'center'
    },
    spinner: { marginBottom: theme.spacing(3) },
    loadingText: {
      color: theme.palette.grey[600],
      marginBottom: theme.spacing(0.5)
    },
    error: { color: theme.palette.error.main }
  }),
  { name: 'SocialDrawerPreviewFile' }
)

interface SocialDrawerPreviewFileProps {
  className?: string
  isVideoTemplate?: boolean
  instance: Optional<IMarketingTemplateInstance | IBrandAsset>
  error: Nullable<string>
}

function SocialDrawerPreviewFile({
  className,
  isVideoTemplate = false,
  instance,
  error
}: SocialDrawerPreviewFileProps) {
  const classes = useStyles()
  const isLoading = !instance && !error

  return (
    <div className={classNames(classes.root, className)}>
      {error && (
        <Typography variant="body1" className={classes.error}>
          {error}
        </Typography>
      )}
      {isLoading && (
        <>
          <CircularProgress className={classes.spinner} />
          <Typography variant="h5" className={classes.loadingText}>
            Looking good!
          </Typography>
          <Typography variant="body1" className={classes.loadingText}>
            We are prepping your {isVideoTemplate ? 'video' : 'design'}; This
            could take
            {isVideoTemplate ? ' few minutes. ' : ' a minute. '}
          </Typography>
          <Typography variant="body1" className={classes.loadingText}>
            Do not close this tab.
          </Typography>
        </>
      )}
      {instance && <SocialDrawerPreviewFileThumbnail instance={instance} />}
    </div>
  )
}

export default SocialDrawerPreviewFile
