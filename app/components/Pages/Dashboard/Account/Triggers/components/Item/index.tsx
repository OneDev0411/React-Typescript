import { useState } from 'react'

import { Button } from '@material-ui/core'

import { TriggerEditMode as EditMode } from '../EditMode'

// const useStyles = makeStyles((theme: Theme) => ({}), {
//   name: 'GlobalTriggerItem'
// })

interface Props {
  data: Nullable<IGlobalTrigger[]>
}

export function TriggerItem({ data }: Props) {
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

      <EditMode
        trigger={data ? data[0] : undefined}
        anchor={anchorEl}
        handleClose={handleCloseEditMode}
      />
    </div>
  )
}
