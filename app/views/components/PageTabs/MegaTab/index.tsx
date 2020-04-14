import React, { useState, ReactNode } from 'react'
import { TabProps, createStyles, makeStyles, Theme } from '@material-ui/core'
import cn from 'classnames'

import { Tab } from '../Tab'

// TODO: Refactor PageTab to our own Tab component
/*
Shayan asked several customizations on Tab component we use (MUI) include
Mega Menu which it doesn't support originally, so we had to do some 
sort of hack. in the feature, we need to implement our own tab component
to cover all features we need and does not break sth
https://www.figma.com/file/zwcX1R35UMgGoll1rtEVEo/Architecture?node-id=8289%3A0
*/
interface Props extends TabProps {
  render: ({ close }: { close: () => void }) => ReactNode
}

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
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
      },
      megaMenuContentClosed: {
        visibility: 'hidden !important' as 'hidden'
      }
    }),
  {
    name: 'MegaTab'
  }
)

export const MegaTab = ({ render, ...props }: Props) => {
  const classes = useStyles()
  const [closeFlag, setCloseFlag] = useState<boolean>(false)

  const close = () => {
    setCloseFlag(true)
    setTimeout(() => {
      setCloseFlag(false)
    }, 1)
  }

  return (
    <div className={classes.megaMenuWrapper}>
      <div
        className={cn(
          classes.megaMenuContent,
          closeFlag && classes.megaMenuContentClosed
        )}
      >
        {render({ close })}
      </div>
      <Tab {...props} />
    </div>
  )
}
