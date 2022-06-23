import { Button, makeStyles, Typography } from '@material-ui/core'

import { noop } from '@app/utils/helpers'

const useStyles = makeStyles(
  theme => ({
    root: {
      width: '100%',
      minHeight: 'calc(100vh - 200px)', // 200px is the height of the header
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing(0, 21)
    },
    icon: { marginBottom: theme.spacing(2) },
    uploadButton: { marginTop: theme.spacing(5) }
  }),
  { name: 'SearchVideoEmptyState' }
)

interface Props {
  text?: string
  shouldShowUploader?: boolean
  onClickUpload?: () => void
}

function SearchVideoEmptyState({
  text = 'There are no videos.',
  shouldShowUploader = false,
  onClickUpload = noop
}: Props) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      {shouldShowUploader && (
        <img
          alt="upload video"
          className={classes.icon}
          src="/static/icons/upload_video.svg"
        />
      )}

      <Typography align="center" variant="body1">
        {text}
      </Typography>

      {shouldShowUploader && (
        <Button
          className={classes.uploadButton}
          color="primary"
          variant="contained"
          onClick={onClickUpload}
        >
          Choose from files
        </Button>
      )}
    </div>
  )
}

export default SearchVideoEmptyState
