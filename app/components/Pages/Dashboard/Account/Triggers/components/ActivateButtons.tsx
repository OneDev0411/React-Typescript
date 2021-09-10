import { useState, useMemo } from 'react'

import { Button, Theme, makeStyles } from '@material-ui/core'
import { mdiCheckCircle } from '@mdi/js'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { TriggerEditMode } from './EditMode'

const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      marginTop: theme.spacing(2)
    },
    button: {
      '&:not(:last-child)': {
        margin: theme.spacing(0.5)
      }
    }
  }),
  { name: 'GlobalTriggerActivateButtons' }
)

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
    <div className={classes.container}>
      {availableTriggers.map(({ type, label }) => (
        <Button
          key={type}
          size="small"
          variant="outlined"
          className={classes.button}
          startIcon={
            <SvgIcon path={mdiCheckCircle} size={muiIconSizes.small} />
          }
          onClick={e => handleShowEditMode(e, type)}
        >
          Activate for {label}
        </Button>
      ))}
      {selectedType && anchorEl && (
        <TriggerEditMode
          eventType={selectedType}
          anchor={anchorEl}
          handleClose={handleCloseEditMode}
        />
      )}
    </div>
  )
}
