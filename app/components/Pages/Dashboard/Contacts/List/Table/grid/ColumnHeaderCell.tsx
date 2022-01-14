import { makeStyles } from '@material-ui/core'
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
      color: `${theme.palette.grey[500]}`,
      padding: theme.spacing(1.25, 0, 1.25, 2),
      maxWidth: '40px',
      fontSize: theme.spacing(0.75)
    },
    titleContainer: {
      flex: '1 0 auto',
      padding: theme.spacing(1.25, 0, 1.25, 1),
      color: `${theme.palette.grey[700]}`,
      letterSpacing: '0.15px',
      ...theme.typography.body2,
      lineHeight: 1.1
    },
    sortActionContainer: {
      color: `${theme.palette.grey[500]}`,
      padding: theme.spacing(1.5, 1),
      maxWidth: '32px',
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
