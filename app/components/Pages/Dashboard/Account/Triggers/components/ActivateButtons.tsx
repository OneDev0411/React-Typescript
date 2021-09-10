import { useState, useMemo } from 'react'

import { Button, Theme, makeStyles } from '@material-ui/core'

import { TriggerEditMode } from './EditMode'

const useStyles = makeStyles((theme: Theme) => ({}), { name: 'GlobalTrigger' })

type AvailbaleTrigger = {
  type: TriggerContactEventTypes
  label: string
}

const Items: AvailbaleTrigger[] = [
  {
    type: 'birthday',
    label: 'Birthday'
  },
  {
    type: 'wedding_anniversary',
    label: 'Wedding Anniversary'
  },
  {
    type: 'home_anniversary',
    label: 'Home Anniversary'
  },
  {
    type: 'child_birthday',
    label: 'Child Birthday'
  }
]

interface Props {
  activeTriggers: TriggerContactEventTypes[]
}

export function ActivateButtons({ activeTriggers }: Props) {
  const classes = useStyles()
  const [selectedType, setSelectedType] =
    useState<Nullable<TriggerContactEventTypes>>(null)
  const [anchorEl, setAnchorEl] = useState<Nullable<HTMLElement>>(null)

  const handleShowEditMode = (
    event: React.MouseEvent<HTMLButtonElement>,
    type: TriggerContactEventTypes
  ) => {
    setSelectedType(type)
    setAnchorEl(event.currentTarget)
  }

  const handleCloseEditMode = () => {
    setSelectedType(null)
    setAnchorEl(null)
  }
  const availableTriggers: AvailbaleTrigger[] = useMemo(
    () => Items.filter(item => !activeTriggers.includes(item.type)),
    [activeTriggers]
  )

  return (
    <>
      {availableTriggers.map(({ type, label }) => (
        <Button key={type} onClick={e => handleShowEditMode(e, type)}>
          Active {label}
        </Button>
      ))}
      {selectedType && anchorEl && (
        <TriggerEditMode
          eventType={selectedType}
          anchor={anchorEl}
          handleClose={handleCloseEditMode}
        />
      )}
    </>
  )
}
