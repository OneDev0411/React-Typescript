import { makeStyles } from '@material-ui/core'
import { mdiDotsVertical, mdiSortAscending, mdiSortDescending } from '@mdi/js'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

const useStyles = makeStyles(
  theme => ({
    container: {
      display: 'flex',
      height: '100%',
      width: '100%',
      gap: theme.spacing(1)
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
      letterSpacing: '0.15px',
      ...theme.typography.body2
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
  sortEnabled?: boolean
  sortDirection?: 'asc' | 'desc'
}

const ColumnHeaderCell = ({
  title,
  iconPath,
  sortEnabled = false,
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
        <span className="text">{title}</span>
      </div>
      {sortEnabled && (
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
