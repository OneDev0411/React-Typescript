import { createStyles, Theme } from '@material-ui/core'
import { fade } from '@material-ui/core/styles'

export const styles = (theme: Theme) =>
  createStyles({
    root: {
      overflow: 'auto'
    },
    dropzone: {
      border: '4px dashed transparent',
      width: 'auto',
      position: 'relative',
      '& > div': {
        height: '100%'
      },
      '&, & > div': {
        display: 'flex',
        flexDirection: 'column',
        flex: '1'
      }
    },
    dropzoneActive: {
      borderColor: fade(theme.palette.grey['500'], 0.5),
      '&::after': {
        content: '"Drop files here"',
        position: 'absolute',
        zIndex: 1,
        left: 0,
        right: 0,
        top: 0,
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
