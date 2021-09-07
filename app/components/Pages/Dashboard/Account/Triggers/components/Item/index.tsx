import { useState } from 'react'

import {
  Button,
  Popover,
  Theme,
  makeStyles,
  Typography
} from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) => ({}), {
  name: 'GlobalTriggerItem'
})

interface Props {}

export function TriggerItem(props: Props) {
  // const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'edit-mode-popover' : undefined

  return (
    <div>
      <Button
        aria-describedby={id}
        variant="contained"
        color="primary"
        onClick={handleClick}
      >
        Item
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
      >
        <Typography>Edit</Typography>
      </Popover>
    </div>
  )
}
