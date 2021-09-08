import { useState } from 'react'

import { Button } from '@material-ui/core'

import { TriggerEditMode as EditMode } from './components/EditMode'

// const useStyles = makeStyles((theme: Theme) => ({}), {
//   name: 'GlobalTriggerItem'
// })

interface Props {}

export function TriggerItem(props: Props) {
  // const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState<Nullable<HTMLElement>>(null)

  const handleShowEditMode = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseEditMode = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleShowEditMode}>
        Item
      </Button>

      <EditMode anchor={anchorEl} handleClose={handleCloseEditMode} />
    </div>
  )
}
