import { useState } from 'react'

import { alpha, makeStyles, Typography } from '@material-ui/core'
import { mdiDotsVertical, mdiSortAscending, mdiSortDescending } from '@mdi/js'
import cn from 'classnames'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

const useStyles = makeStyles(
  theme => ({
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'end',

      height: '100%',
      width: '100%',
      backgroundColor: `${alpha(theme.palette.grey[50], 0.75)}`,
      cursor: 'pointer',

      '&.primary': {
        paddingLeft: theme.spacing(1)
      },

      '&:hover': {
        backgroundColor: `${alpha(theme.palette.grey[100], 0.75)}`
      }
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
      justifyContent: 'center',
      color: `${theme.palette.grey[500]}`,
      fontSize: theme.spacing(0.75),
      width: theme.spacing(4)
    },
    sortIconBg: {
      display: 'none',

      width: theme.spacing(3),
      height: theme.spacing(3),
      borderRadius: theme.spacing(3),

      '&.cellHovered': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        color: `${theme.palette.action.disabled}`
      },

      '&:hover': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        backgroundColor: `${theme.palette.action.hover}`,
        color: `${theme.palette.tertiary.dark}`
      }
    }
  }),
  { name: 'ColumnHeaderCell' }
)

interface Props {
  title?: string
  iconPath?: string
  sortEnabled?: boolean
  sortDirection?: 'asc' | 'desc'
  isPrimary?: boolean
}

const ColumnHeaderCell = ({
  title,
  iconPath,
  sortEnabled = false,
  sortDirection,
  isPrimary = false
}: Props) => {
  const classes = useStyles()

  const [isHovered, setIsHovered] = useState(false)

  const onHoverIn = () => setIsHovered(true)
  const onHoverOut = () => setIsHovered(false)

  return (
    <div
      className={cn(classes.container, {
        primary: isPrimary
      })}
      onMouseEnter={onHoverIn}
      onMouseLeave={onHoverOut}
    >
      {iconPath && (
        <div className={classes.iconContainer}>
          <SvgIcon size={muiIconSizes.small} path={iconPath} />
        </div>
      )}
      <div className={classes.titleContainer}>
        <Typography variant="body2">{title}</Typography>
      </div>
      {sortEnabled && (
        <div
          className={cn(classes.sortActionContainer, {
            hovered: isHovered
          })}
        >
          <div
            className={cn(classes.sortIconBg, {
              cellHovered: isHovered
            })}
          >
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
        </div>
      )}
    </div>
  )
}

export default ColumnHeaderCell
