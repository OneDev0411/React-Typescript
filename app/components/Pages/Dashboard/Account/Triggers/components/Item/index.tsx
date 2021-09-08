import { useState } from 'react'

import { Button, Popover, Theme, makeStyles } from '@material-ui/core'

import { TriggerEditMode as EditMode } from './components/EditMode'

const useStyles = makeStyles((theme: Theme) => ({}), {
  name: 'GlobalTriggerItem'
})

interface Props {}

export function TriggerItem(props: Props) {
  // const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const handleShowEditMode = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseEditMode = () => {
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
        onClick={handleShowEditMode}
      >
        Item
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleCloseEditMode}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
      >
        <EditMode />
      </Popover>
    </div>
  )
}
