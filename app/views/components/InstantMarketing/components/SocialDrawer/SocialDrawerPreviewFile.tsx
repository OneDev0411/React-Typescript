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
    loadingText: { color: theme.palette.grey[600] },
    error: { color: theme.palette.error.main }
  }),
  { name: 'SocialDrawerPreviewFile' }
)

interface SocialDrawerPreviewFileProps {
  className?: string
  instance: Optional<IMarketingTemplateInstance | IBrandAsset>
  error: Nullable<string>
}

function SocialDrawerPreviewFile({
  className,
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
          <Typography variant="body1" className={classes.loadingText}>
            Looking good! We are prepping your design to share, this could take
            a minute...
          </Typography>
        </>
      )}
      {instance && <SocialDrawerPreviewFileThumbnail instance={instance} />}
    </div>
  )
}

export default SocialDrawerPreviewFile
