import { createStyles, makeStyles, Theme } from '@material-ui/core'

export const useTableStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      darkHeader: {
        '& .MuiTableHead-root .MuiTableRow-root': {
          background: theme.palette.grey['300'],
          height: '2.5rem',
          '& .MuiTableCell-root:first-child': {
            borderTopLeftRadius: theme.shape.borderRadius,
            borderBottomLeftRadius: theme.shape.borderRadius
          },
          '& .MuiTableCell-root:last-child': {
            borderTopRightRadius: theme.shape.borderRadius,
            borderBottomRightRadius: theme.shape.borderRadius
          }
        }
      },
      stripedRows: {
        '& .MuiTableBody-root .MuiTableRow-root:nth-child(even)': {
          background: theme.palette.grey['50']
        }
      }
    }),
  { name: 'Table' }
)
