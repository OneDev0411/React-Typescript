import { createStyles } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

export const styles = () =>
  createStyles({
    row: {
      '& td': {
        opacity: 0.5,
        '&.primary, &.opaque': {
          opacity: 1
        },
        '&.semi-transparent': {
          opacity: 0.5
        },
        '&.transparent': {
          opacity: 0
        }
      },
      '&:hover td': {
        opacity: 1,
        '&.semi-transparent': {
          opacity: 1
        },
        '&.transparent': {
          opacity: 1
        }
      }
    }
  })

export const useGridStyles = makeStyles(styles)
