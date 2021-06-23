import { createStyles, Theme } from '@material-ui/core/styles'

import { ClassesProps } from 'utils/ts-utils'

interface StyleProps extends ClassesProps<typeof sharedStyles> {
  pastEvent?: boolean
}

export const sharedStyles = (theme: Theme) =>
  createStyles({
    row: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing(0, 2),
      transition: '0.1s ease-in background-color',
      width: '100%'
    },
    container: {
      display: 'flex',
      alignItems: 'center'
    },
    title: (props: StyleProps) => ({
      color: props.pastEvent
        ? theme.palette.grey[500]
        : theme.palette.common.black,
      ...theme.typography.body2,
      '& a': {
        color: props.pastEvent
          ? `${theme.palette.grey[500]} !important`
          : 'inherit'
      }
    }),
    time: {
      width: '8rem',
      flexShrink: 0,
      color: theme.palette.grey[700],
      ...theme.typography.caption
    },
    link: {
      cursor: 'pointer'
    },
    icon: {
      display: 'flex',
      flexShrink: 0,
      alignItems: 'center',
      justifyContent: 'center',
      width: '1rem',
      height: '1rem',
      borderRadius: '100%',
      marginRight: '1rem'
    },
    buttonContainer: {
      position: 'absolute !important' as 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      width: '100%',
      height: '100%',
      opacity: 0
    },
    emptyRowStyles: {
      alignItems: 'center',
      height: '100%',
      color: theme.palette.grey[600],
      ...theme.typography.body2
    },
    splitter: {
      color: theme.palette.grey[500],
      margin: theme.spacing(0, 0.5)
    }
  })
