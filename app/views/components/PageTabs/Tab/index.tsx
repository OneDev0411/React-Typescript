import React, { ReactNode } from 'react'
import {
  Tab as BaseTab,
  TabProps,
  createStyles,
  makeStyles,
  Theme
} from '@material-ui/core'

// TODO: Refactor PageTab to our own Tab component
/*
Shayan asked several customizations on Tab component we use (MUI) include
Mega Menu which it doesn't support originally, so we had to do some 
sort of hack. in the feature, we need to implement our own tab component
to cover all features we need and does not break sth
https://www.figma.com/file/zwcX1R35UMgGoll1rtEVEo/Architecture?node-id=8289%3A0
*/
interface Props extends TabProps {
  renderMegaMenu?: () => ReactNode
}

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      root: {
        minWidth: 'unset',
        color: theme.palette.common.black,
        ...theme.typography.body1,
        zIndex: 1,
        '&:hover': {
          color: theme.palette.primary.main
        }
      },
      selected: {
        ...theme.typography.subtitle1,
        '& button[aria-controls="menu-list-grow"]': {
          color: theme.palette.primary.main,
          '& svg': {
            fill: theme.palette.primary.main
          }
        }
      },
      megaMenuWrapper: {
        '&:hover $megaMenuContent': {
          visibility: 'visible'
        }
      },
      megaMenuContent: {
        padding: theme.spacing(2.5, 0),
        position: 'absolute',
        top: 56,
        left: 0,
        width: '100%',
        minHeight: 250,
        zIndex: theme.zIndex.gridAction,
        background: theme.palette.background.paper,
        boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.1)',
        // hack for hanling visibilty bug on safari
        borderTop: `1px solid ${theme.palette.divider}`,
        visibility: 'hidden',
        '&:hover': {
          visibility: 'visible',
          '& + $root': {
            color: theme.palette.primary.main
          }
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
      <div className={classes.megaMenuWrapper}>
        <div className={classes.megaMenuContent}>{renderMegaMenu()}</div>
        {baseContent}
      </div>
    )
  }

  return baseContent
}
