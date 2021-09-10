import { useState, useMemo } from 'react'

import { Button, Theme, makeStyles } from '@material-ui/core'
import { mdiRing, mdiHomeHeart, mdiCakeVariant } from '@mdi/js'

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
  icon: string
  label: string
}

const Items: AvailbaleTrigger[] = [
  {
    type: 'birthday',
    icon: mdiCakeVariant,
    label: 'Birthday'
  },
  {
    type: 'wedding_anniversary',
    icon: mdiRing,
    label: 'Wedding Anniversary'
  },
  {
    type: 'home_anniversary',
    icon: mdiHomeHeart,
    label: 'Home Anniversary'
  },
  {
    type: 'child_birthday',
    icon: mdiCakeVariant,
    label: 'Child Birthday'
  }
]

interface Props {
  activeTriggers: TriggerContactEventTypes[]
  onActive: () => void
}

export function ActivateButtons({ activeTriggers, onActive }: Props) {
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
      {availableTriggers.map(({ type, icon, label }) => (
        <Button
          key={type}
          size="small"
          variant="outlined"
          className={classes.button}
          startIcon={<SvgIcon path={icon} size={muiIconSizes.small} />}
          onClick={e => handleShowEditMode(e, type)}
        >
          Activate for {label}
        </Button>
      ))}
      {selectedType && anchorEl && (
        <TriggerEditMode
          eventType={selectedType}
          anchor={anchorEl}
          callback={onActive}
          handleClose={handleCloseEditMode}
        />
      )}
    </div>
  )
}
