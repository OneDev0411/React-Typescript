import { createStyles, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

export const styles = (theme: Theme) =>
  createStyles({
    row: {
      '&:first-child .column': {
        borderTop: `1px solid ${theme.palette.action.disabledBackground}`
      },
      '& .column': {
        height: '100%',
        borderBottom: `1px solid ${theme.palette.action.disabledBackground}`,
        borderRight: `1px solid ${theme.palette.action.disabledBackground}`,
        backgroundColor: theme.palette.common.white,
        '&.row-selection': {
          borderRight: 'none'
        },
        '&:first-child': {
          paddingLeft: `${theme.spacing(4)}px !important`
        },
        '&:last-child': {
          borderRight: 'none',
          paddingRight: `${theme.spacing(4)}px !important`
        }
      }
    }
  })

export const useGridBorderedStyles = makeStyles(styles, {
  name: 'grid-bordered-styles'
})
