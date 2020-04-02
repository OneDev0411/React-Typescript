import React, { ReactNode } from 'react'
import {
  Tab as BaseTab,
  TabProps,
  createStyles,
  makeStyles,
  Theme
} from '@material-ui/core'

interface Props extends TabProps {
  renderMegaMenu?: () => ReactNode
}

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      root: {
        minWidth: theme.spacing(8),
        color: theme.palette.common.black,
        ...theme.typography.body1,
        zIndex: 1,
        '&:hover': {
          color: theme.palette.primary.main,
          '& + $megaMenuContainer': {
            visibility: 'visible'
          }
        }
      },
      selected: {
        ...theme.typography.subtitle1,
        fontWeight: 'bold',
        '& button[aria-controls="menu-list-grow"]': {
          color: theme.palette.primary.main,
          '& svg': {
            fill: theme.palette.primary.main
          }
        }
      },
      megaMenuContainer: {
        padding: theme.spacing(2.5, 0),
        position: 'absolute',
        top: 57,
        left: 0,
        width: '100%',
        minHeight: 250,
        zIndex: theme.zIndex.gridAction,
        background: theme.palette.background.paper,
        boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.1)',
        visibility: 'hidden',
        '&:hover': {
          visibility: 'visible'
        },
        '&::after,&::before': {
          // hack for having edge to edge megamenu
          position: 'absolute',
          content: "''",
          top: 0,
          width: '50%',
          height: '100%',
          background: theme.palette.background.paper,
          zIndex: -1
        },
        '&::before': {
          left: '-49%',
          boxShadow: '-15px 10px 15px rgba(0, 0, 0, 0.1)'
        },
        '&::after': {
          right: '-49%',
          boxShadow: '15px 10px 15px rgba(0, 0, 0, 0.1)'
        }
      }
    }),
  {
    name: 'Tab'
  }
)

export const Tab = ({ renderMegaMenu, ...props }: Props) => {
  const classes = useStyles({ renderMegaMenu })

  const baseContent = (
    <BaseTab
      {...props}
      classes={{ root: classes.root, selected: classes.selected }}
    />
  )

  if (renderMegaMenu) {
    return (
      <div>
        {baseContent}
        <div className={classes.megaMenuContainer}>{renderMegaMenu()}</div>
      </div>
    )
  }

  return baseContent
}
