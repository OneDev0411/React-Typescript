import { createStyles, Theme } from '@material-ui/core'
import { fade } from '@material-ui/core/styles'

export const styles = (theme: Theme) =>
  createStyles({
    root: {
      overflow: 'auto',
      position: 'relative'
    },
    dropzone: {
      width: 'auto',
      height: '100%',
      '&, & > div': {
        display: 'flex',
        flexDirection: 'column',
        flex: '1'
      }
    },
    dropzoneActive: {
      '&::after': {
        border: `4px dashed ${fade(theme.palette.grey['500'], 0.5)}`,
        content: '"Drop files here"',
        position: 'absolute',
        zIndex: 1,
        left: 0,
        right: 0,
        top: theme.spacing(6),
        bottom: 0,
        background: fade(theme.palette.common.white, 0.8),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.palette.text.hint,
        ...theme.typography.h3
      }
    },
    dropzoneReject: {
      borderColor: fade(theme.palette.warning.main, 0.7)
    },
    toolbar: {},
    content: {
      paddingTop: `${theme.spacing(0.5)}px`
    }
  })
