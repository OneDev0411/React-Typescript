import React, { useState, ReactNode } from 'react'
import { Popover, makeStyles, createStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    popoverRoot: {
      position: 'absolute !important' as 'absolute'
    },
    popoverPaper: {
      width: '100%',
      maxHeight: 'unset',
      maxWidth: 'unset',
      left: '0 !important' as any,
      borderRadius: 0
    },
    contentContainer: {
      padding: theme.spacing(2.5),
      left: 0,
      width: '100%',
      minHeight: 250,
      color: theme.palette.text.primary
    }
  })
)

interface Props {
  title: string
  children: ReactNode
}

const MegaMenu = ({ title, children }: Props) => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'megamenu-popover' : undefined
  const containerRef =
    document.getElementsByClassName('l-app__main')[0] || document.body

  return (
    <div>
      <span aria-describedby={id} color="primary" onClick={handleClick}>
        {title}
      </span>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        container={containerRef}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        classes={{
          root: classes.popoverRoot,
          paper: classes.popoverPaper
        }}
      >
        <div className={classes.contentContainer}>{children}</div>
      </Popover>
    </div>
  )
}

export default MegaMenu
