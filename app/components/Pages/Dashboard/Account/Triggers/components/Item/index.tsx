import { useState } from 'react'

import { Button } from '@material-ui/core'

import { TriggerEditMode as EditMode } from '../EditMode'

// const useStyles = makeStyles((theme: Theme) => ({}), {
//   name: 'GlobalTriggerItem'
// })

interface Props {
  list: Nullable<IGlobalTrigger[]>
}

export function TriggerItem({ list }: Props) {
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
      {/* <Button variant="contained" color="primary" onClick={handleShowEditMode}>
        Item
      </Button> */}
      {list?.map(i => (
        <span key={i.event_type}>
          {i.subject}-{i.event_type}
        </span>
      ))}
      <EditMode
        trigger={list ? list[0] : undefined}
        anchor={anchorEl}
        handleClose={handleCloseEditMode}
      />
    </div>
  )
}
