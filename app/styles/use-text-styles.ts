import { createStyles, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

export const useTextStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      noWrap: {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap'
      }
    }),
  { name: 'TextStyles' }
)
