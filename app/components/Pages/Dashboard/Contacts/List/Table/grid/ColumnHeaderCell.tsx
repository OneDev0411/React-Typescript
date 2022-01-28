import { makeStyles, Typography } from '@material-ui/core'
import { mdiDotsVertical, mdiSortAscending, mdiSortDescending } from '@mdi/js'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

const useStyles = makeStyles(
  theme => ({
    container: {
      display: 'flex',
      height: '100%',
      width: '100%'
    },
    iconContainer: {
      width: theme.spacing(4),
      fontSize: theme.spacing(0.75),
      color: `${theme.palette.grey[500]}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'end'
    },
    titleContainer: {
      display: 'flex',
      flex: '1 0 auto',
      alignItems: 'center',
      color: `${theme.palette.grey[700]}`,
      padding: theme.spacing(0, 1),
      letterSpacing: '0.15px'
    },
    sortActionContainer: {
      display: 'flex',
      alignItems: 'center',
      width: theme.spacing(4),
      justifyContent: 'center',
      color: `${theme.palette.grey[500]}`,
      fontSize: theme.spacing(0.75)
    }
  }),
  { name: 'ColumnHeaderCell' }
)

interface Props {
  title?: string
  iconPath?: string
  sortable?: boolean
  sortDirection?: 'asc' | 'desc'
}

const ColumnHeaderCell = ({
  title,
  iconPath,
  sortable = false,
  sortDirection
}: Props) => {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      {iconPath && (
        <div className={classes.iconContainer}>
          <SvgIcon size={muiIconSizes.small} path={iconPath} />
        </div>
      )}
      <div className={classes.titleContainer}>
        <Typography variant="body2">{title}</Typography>
      </div>
      {sortable && (
        <div className={classes.sortActionContainer}>
          <SvgIcon
            size={muiIconSizes.small}
            path={
              !sortDirection
                ? mdiDotsVertical
                : sortDirection === 'asc'
                ? mdiSortAscending
                : mdiSortDescending
            }
          />
        </div>
      )}
    </div>
  )
}

export default ColumnHeaderCell
