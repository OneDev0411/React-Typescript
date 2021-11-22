import { MouseEvent, useState, useRef } from 'react'

import { Typography, Theme, alpha, makeStyles } from '@material-ui/core'
import {
  mdiRing,
  mdiHomeHeart,
  mdiCakeVariant,
  mdiYoutubeStudio
} from '@mdi/js'

import { muiIconSizes } from '@app/views/components/SvgIcons/icon-sizes'
import { SvgIcon } from '@app/views/components/SvgIcons/SvgIcon'

import { TriggerEditMode as SetupMode } from '../../EditMode'

import { getAttributeName } from './helpers'

const useStyles = makeStyles(
  (theme: Theme) => ({
    placeholder: {
      maxWidth: '200px', // From figma
      padding: theme.spacing(2),
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      textAlign: 'center',
      cursor: 'pointer'
    },
    placeholderIcon: {
      display: 'flex',
      justifyContent: 'center',
      padding: theme.spacing(5.25),
      marginBottom: theme.spacing(2.5),
      background: alpha(theme.palette.primary.main, 0.15),
      color: theme.palette.primary.main,
      textAlign: 'center',
      borderRadius: theme.shape.borderRadius
    }
  }),
  { name: 'GlobalTriggerSetupButton' }
)

const Icons: Record<TriggerContactEventTypes, string> = {
  birthday: mdiCakeVariant,
  wedding_anniversary: mdiRing,
  home_anniversary: mdiHomeHeart
}

interface Props {
  setupType: TriggerContactEventTypes
}

export function SetupButton({ setupType }: Props) {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState<Nullable<HTMLElement>>(null)
  const setupModeContainerRef = useRef<Nullable<HTMLDivElement>>(null)

  const handleShowSetupMode = (event: MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseSetupMode = () => {
    setAnchorEl(null)
  }

  return (
    <div ref={setupModeContainerRef}>
      <div className={classes.placeholder} onClick={handleShowSetupMode}>
        <div className={classes.placeholderIcon}>
          <SvgIcon
            path={Icons[setupType] || mdiYoutubeStudio}
            size={muiIconSizes.xlarge}
          />
        </div>
        <Typography variant="body2" color="primary">
          Setup for {getAttributeName(setupType)}
        </Typography>
      </div>
      {setupType && anchorEl && (
        <SetupMode
          eventType={setupType}
          anchor={anchorEl}
          containerRef={setupModeContainerRef.current}
          handleClose={handleCloseSetupMode}
        />
      )}
    </div>
  )
}
