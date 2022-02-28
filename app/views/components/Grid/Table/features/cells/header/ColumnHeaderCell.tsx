import React, { useState } from 'react'

import { makeStyles, Typography, alpha } from '@material-ui/core'
import { mdiDotsVertical, mdiSortAscending, mdiSortDescending } from '@mdi/js'
import cn from 'classnames'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

const useStyles = makeStyles(
  theme => ({
    container: ({ width }: { width: number | string }) => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'end',

      height: '100%',
      width,
      backgroundColor: `${alpha(theme.palette.grey[50], 0.75)}`,
      borderRight: `1px solid ${theme.palette.divider}`,
      borderTop: `1px solid ${theme.palette.divider}`,
      borderBottom: `1px solid ${theme.palette.divider}`,
      cursor: 'pointer',

      '&:hover': {
        backgroundColor: `${alpha(theme.palette.grey[100], 0.75)}`
      }
    }),
    primaryContainer: {
      paddingLeft: theme.spacing(1)
    },
    iconContainer: {
      width: '32px',
      height: '100%',
      color: theme.palette.grey[500],
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end'
    },
    titleContainer: {
      display: 'flex',
      flex: '1 0 auto',
      alignItems: 'center',
      color: theme.palette.grey[700],
      padding: theme.spacing(0, 1),
      height: '100%'
    },
    sortActionContainer: {
      display: 'flex',
      alignItems: 'center',
      width: '32px',
      justifyContent: 'center',
      color: `${theme.palette.grey[500]}`,
      fontSize: theme.spacing(0.75)
    },
    sortIconBg: {
      display: 'none',

      width: theme.spacing(3),
      height: theme.spacing(3),
      borderRadius: theme.spacing(3),

      '&:hover': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        backgroundColor: `${theme.palette.action.hover}`,
        color: `${theme.palette.tertiary.dark}`
      }
    },
    sortIconBgCellHovered: {
      display: 'flex !important',
      alignItems: 'center',
      justifyContent: 'center',

      color: `${theme.palette.action.disabled}`
    }
  }),
  { name: 'ColumnHeaderCell' }
)

interface Props {
  title: string
  iconPath?: string
  sortable?: boolean
  sortDirection?: 'asc' | 'desc'
  isPrimary?: boolean
  width: number | string
}

const ColumnHeaderCell = ({
  title,
  iconPath,
  sortDirection,
  isPrimary = false,
  sortable = false,
  width = '100%'
}: Props) => {
  const classes = useStyles({ width })

  const [isHovered, setIsHovered] = useState(false)
  const onHoverIn = () => setIsHovered(true)
  const onHoverOut = () => setIsHovered(false)

  let sortButton: Nullable<React.ReactNode> = null

  if (sortable) {
    let sortIcon: string = mdiDotsVertical

    if (sortDirection) {
      sortIcon = sortDirection === 'asc' ? mdiSortAscending : mdiSortDescending
    }

    sortButton = (
      <div className={classes.sortActionContainer}>
        <div
          className={cn(classes.sortIconBg, {
            [classes.sortIconBgCellHovered]: isHovered
          })}
        >
          <SvgIcon size={muiIconSizes.small} path={sortIcon} />
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(classes.container, {
        [classes.primaryContainer]: isPrimary
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
      {sortButton}
    </div>
  )
}

export default ColumnHeaderCell
