import React from 'react'

import { Popover, createStyles, makeStyles, Theme } from '@material-ui/core'

import { DropdownToggleButton } from 'components/DropdownToggleButton'

import YardSignIcon from 'components/SvgIcons/YardSign/YardSignIcon'

import { useIconStyles } from 'views/../styles/use-icon-styles'

interface Props {
  style: React.CSSProperties
}

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    button: {
      // same as action-button in components/button to make it consistent with other buttons
      height: '2.375rem',
      marginLeft: theme.spacing(0.5),
      fontSize: '1rem',
      borderColor: theme.palette.common.black
    }
  })
})

export function YardSign({ style }: Props) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

  const classes = useStyles()
  const iconClasses = useIconStyles()

  const handleOpen = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <DropdownToggleButton
        isActive={false}
        variant="outlined"
        color="secondary"
        size="small"
        className={classes.button}
        onClick={handleOpen}
      >
        <YardSignIcon className={iconClasses.rightMargin} /> Yard Sign
      </DropdownToggleButton>

      <Popover
        id={anchorEl ? 'simple-popover' : undefined}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        style={{ zIndex: 1002 }}
      >
        ----
      </Popover>
    </>
  )
}
